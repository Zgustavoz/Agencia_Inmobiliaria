import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from .models import Pago
from modulo_administracion_configuracion.models import Tenant
from django.utils import timezone
from datetime import timedelta

# Importar el ViewSet base o crear una clase que soporte tenant_id
from gestion_usuarios.authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator # Importar method_decorator

stripe.api_key = config('STRIPE_SECRET_KEY')

@method_decorator(csrf_exempt, name='dispatch') # Aplicar correctamente el decorador
class CreateCheckoutSessionView(APIView):
    """
    Vista para crear una sesión de pago en Stripe.
    Utiliza CookieJWTAuthentication para asegurar que el tenant_id esté presente.
    """
    authentication_classes = [CookieJWTAuthentication]
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
                success_url=config('FRONTEND_URL') + '/dashboard?payment=success',
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
            tenant_id = session.metadata.tenant_id
            plan_codigo = session.metadata.plan_codigo
            
            # Usamos getattr() solo aquí por si alguna vez olvidas mandar este dato, que tenga un fallback de 3
            max_propiedades = int(getattr(session.metadata, 'max_propiedades', 3))

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