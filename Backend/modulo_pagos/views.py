import stripe
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from .models import Pago
from modulo_administracion_configuracion.models import Tenant
from modulo_contratos.models import Contrato, PagoContrato
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.authentication import JWTAuthentication

# Importar el ViewSet base o crear una clase que soporte tenant_id
from gestion_usuarios.authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator # Importar method_decorator

stripe.api_key = config('STRIPE_SECRET_KEY')


def _metadata_value(metadata, key, default=None):
    """Permite leer metadata de Stripe como objeto o como dict en tests."""
    if isinstance(metadata, dict):
        return metadata.get(key, default)
    return getattr(metadata, key, default)


@method_decorator(csrf_exempt, name='dispatch') # Aplicar correctamente el decorador
class CreateCheckoutSessionView(APIView):
    """
    Vista para crear una sesión de pago en Stripe.
    Utiliza CookieJWTAuthentication para asegurar que el tenant_id esté presente.
    """
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Obtener datos del plan del request
            plan_id = request.data.get('plan_id') # 'pro', 'enterprise'
            
            # Definir precios
            plan_data = {
                'pro': {
                    'monto': 2900, # $29.00
                    'nombre': 'Plan Profesional',
                    'max_propiedades': 50,
                    'codigo': 'profesional'
                },
                'enterprise': {
                    'monto': 9900, 
                    'nombre': 'Plan Empresa',
                    'max_propiedades': 999,
                    'codigo': 'empresa'
                }
            }

            selected_plan = plan_data.get(plan_id)
            if not selected_plan:
                return Response({'error': 'Plan no válido'}, status=status.HTTP_400_BAD_REQUEST)

            # Verificar que tengamos el tenant_id (inyectado por el autenticador)
            tenant_id = getattr(request, 'tenant_id', None)
            if not tenant_id:
                return Response({'error': 'No se pudo identificar la inmobiliaria (Tenant ID missing)'}, status=status.HTTP_403_FORBIDDEN)

            # Crear sesión de checkout
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': selected_plan['nombre'],
                            },
                            'unit_amount': selected_plan['monto'],
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=config('FRONTEND_URL') + '/dashboard/settings?payment=success',
                cancel_url=config('FRONTEND_URL') + '/suscripciones?payment=cancel',
                metadata={
                    'tenant_id': tenant_id,
                    'plan_codigo': selected_plan['codigo'],
                    'max_propiedades': selected_plan['max_propiedades']
                }
            )

            # Registrar pago pendiente
            Pago.objects.create(
                tenant_id=tenant_id,
                stripe_checkout_id=checkout_session.id,
                monto=selected_plan['monto'] / 100,
                plan_adquirido=selected_plan['codigo']
            )

            return Response({'url': checkout_session.url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ContratoCriteriosPagoView(APIView):
    """
    Devuelve los criterios/detalles del contrato y sus cuotas registradas.
    """
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id_contrato, *args, **kwargs):
        contrato = get_object_or_404(Contrato, id_contrato=id_contrato)

        data = {
            'contrato': {
                'id_contrato': contrato.id_contrato,
                'codigo_contrato': contrato.codigo_contrato,
                'cliente': f"{contrato.cliente.nombres} {contrato.cliente.apellidos}",
                'agente': f"{contrato.agente.nombres} {contrato.agente.apellidos}",
                'propiedad': f"{contrato.propiedad.codigo_propiedad} - {contrato.propiedad.titulo}",
                'tipo_operacion': contrato.tipo_operacion,
                'estado_contrato': contrato.estado_contrato,
                'estado_real': contrato.estado_calculado,
                'monto': str(contrato.monto),
                'fecha_inicio': contrato.fecha_inicio,
                'fecha_fin': contrato.fecha_fin,
                'garantia': str(contrato.garantia) if contrato.garantia is not None else None,
                'comision': str(contrato.comision),
                'condiciones': contrato.condiciones,
                'observaciones': contrato.observaciones,
            },
            'pagos': [
                {
                    'id_pago': pago.id_pago,
                    'monto': str(pago.monto),
                    'fecha_vencimiento': pago.fecha_vencimiento,
                    'fecha_pago': pago.fecha_pago,
                    'estado': pago.estado,
                    'observaciones': pago.observaciones,
                }
                for pago in contrato.pagos.all().order_by('fecha_vencimiento')
            ]
        }

        return Response(data)


@method_decorator(csrf_exempt, name='dispatch')
class CreateContratoCheckoutSessionView(APIView):
    """
    Crea una sesion de Stripe para pagar una cuota pendiente de contrato.
    """
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id_pago, *args, **kwargs):
        try:
            pago_contrato = get_object_or_404(PagoContrato, id_pago=id_pago)

            if pago_contrato.estado != 'PENDIENTE':
                return Response(
                    {'error': 'Este pago de contrato no esta pendiente.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            contrato = pago_contrato.contrato
            tenant = contrato.propiedad.tenant
            if not tenant:
                return Response(
                    {'error': 'El contrato no tiene una inmobiliaria asociada para registrar el pago.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            monto_centavos = int(pago_contrato.monto * 100)
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': f"Pago contrato {contrato.codigo_contrato}",
                            },
                            'unit_amount': monto_centavos,
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=config('FRONTEND_URL') + f'/contratos/{contrato.id_contrato}/pagos?payment=success',
                cancel_url=config('FRONTEND_URL') + f'/contratos/{contrato.id_contrato}/pagos?payment=cancel',
                metadata={
                    'tipo_pago': 'contrato',
                    'tenant_id': tenant.id,
                    'contrato_id': contrato.id_contrato,
                    'pago_contrato_id': pago_contrato.id_pago,
                }
            )

            Pago.objects.create(
                tenant=tenant,
                pago_contrato=pago_contrato,
                stripe_checkout_id=checkout_session.id,
                monto=pago_contrato.monto,
                plan_adquirido='contrato'
            )

            return Response({
                'url': checkout_session.url,
                'checkout_id': checkout_session.id,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ConfirmarPagoContratoView(APIView):
    """
    Confirma un pago de contrato sin depender del webhook.
    Revisa la sesion de Stripe y, si esta pagada, marca la cuota como PAGADO.
    """
    authentication_classes = [CookieJWTAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id_pago, *args, **kwargs):
        try:
            pago_contrato = get_object_or_404(PagoContrato, id_pago=id_pago)

            if pago_contrato.estado == 'PAGADO':
                return Response({
                    'estado': 'PAGADO',
                    'mensaje': 'Este pago ya fue registrado.'
                })

            pago = Pago.objects.filter(
                pago_contrato=pago_contrato,
                plan_adquirido='contrato'
            ).order_by('-fecha_pago').first()

            if not pago:
                return Response(
                    {'error': 'No existe una sesion de Stripe para este pago.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            session = stripe.checkout.Session.retrieve(pago.stripe_checkout_id)
            payment_status = getattr(session, 'payment_status', None)
            checkout_status = getattr(session, 'status', None)

            if payment_status == 'paid' or checkout_status == 'complete':
                pago.estado = 'completado'
                pago.save()

                pago_contrato.estado = 'PAGADO'
                pago_contrato.fecha_pago = timezone.now().date()
                pago_contrato.observaciones = 'Pago realizado por Stripe'
                pago_contrato.save()

                return Response({
                    'estado': 'PAGADO',
                    'mensaje': 'Pago confirmado correctamente.'
                })

            return Response({
                'estado': pago_contrato.estado,
                'mensaje': 'El pago todavia no aparece completado en Stripe.'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = config('STRIPE_WEBHOOK_SECRET')

    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        try:
            # 🛑 FORMA CORRECTA: En Stripe se accede a los datos por "punto", no con .get()
            checkout_id = session.id
            tipo_pago = _metadata_value(session.metadata, 'tipo_pago')

            if tipo_pago == 'contrato':
                pago = Pago.objects.get(stripe_checkout_id=checkout_id)
                pago.estado = 'completado'
                pago.save()

                if pago.pago_contrato:
                    pago.pago_contrato.estado = 'PAGADO'
                    pago.pago_contrato.fecha_pago = timezone.now().date()
                    pago.pago_contrato.observaciones = 'Pago realizado por Stripe'
                    pago.pago_contrato.save()

                print(f"Pago de contrato actualizado: {checkout_id}")
                return HttpResponse(status=200)

            tenant_id = _metadata_value(session.metadata, 'tenant_id')
            plan_codigo = _metadata_value(session.metadata, 'plan_codigo')
            
            # Usamos getattr() solo aquí por si alguna vez olvidas mandar este dato, que tenga un fallback de 3
            max_propiedades = int(_metadata_value(session.metadata, 'max_propiedades', 3))

            # Actualizamos el pago
            pago = Pago.objects.get(stripe_checkout_id=checkout_id)
            pago.estado = 'completado'
            pago.save()

            # Actualizamos el Tenant (Inmobiliaria)
            tenant = Tenant.objects.get(id=tenant_id)
            tenant.plan = plan_codigo
            tenant.max_propiedades = max_propiedades
            tenant.estado = True
            tenant.fecha_vencimiento_pago = timezone.now().date() + timedelta(days=30)
            tenant.save()
            
            print(f"✓ Suscripción actualizada para Tenant {tenant.nombre}")
            
        except Exception as e:
            print(f"Error procesando webhook: {str(e)}")
            return HttpResponse(status=500)

    return HttpResponse(status=200)

