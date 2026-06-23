from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from gestion_usuarios.models import Usuario, Rol
from modulo_administracion_configuracion.models import Moneda, Tenant
from modulo_contratos.models import Contrato, PagoContrato
from modulo_inmuebles.models import Propiedad, Zona
from modulo_pagos.models import Pago
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import patch

class PagoTests(APITestCase):
    client = APIClient()

    def setUp(self):
        # Crear un tenant
        self.tenant = Tenant.objects.create(
            nombre="Tenant Test",
            plan="basico",
            max_propiedades=3,
            estado=True,
            fecha_vencimiento_pago=timezone.now().date() + timedelta(days=30)
        )
        # Crear un usuario y asignarle el rol de Administrador
        self.user = Usuario.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword",
            nombres="Test",
            apellidos="User",
            tenant=self.tenant
        )
        rol_admin = Rol.objects.create(nombre="Administrador")
        self.user.roles.add(rol_admin)
        self.user.es_admin = True # Asegurar que es admin para permisos
        self.user.save()

        rol_cliente = Rol.objects.create(nombre="Cliente")
        rol_agente = Rol.objects.create(nombre="Agente")
        self.cliente = Usuario.objects.create_user(
            username="cliente",
            email="cliente@example.com",
            password="testpassword",
            nombres="Cliente",
            apellidos="Demo",
            tenant=self.tenant
        )
        self.cliente.roles.add(rol_cliente)
        self.agente = Usuario.objects.create_user(
            username="agente",
            email="agente@example.com",
            password="testpassword",
            nombres="Agente",
            apellidos="Demo",
            tenant=self.tenant
        )
        self.agente.roles.add(rol_agente)

        self.moneda = Moneda.objects.create(
            codigo="USD",
            nombre="Dolar",
            simbolo="$",
            estado=True
        )
        self.zona = Zona.objects.create(
            pais="Bolivia",
            ciudad="Santa Cruz",
            zona="Centro"
        )
        self.propiedad = Propiedad.objects.create(
            codigo_propiedad="PROP-001",
            titulo="Departamento demo",
            id_modalidad=1,
            modalidad_operacion="Alquiler",
            zona=self.zona,
            moneda=self.moneda,
            tenant=self.tenant,
            precio=Decimal("500.00"),
            superficie_total_m2=Decimal("80.00"),
            superficie_construida_m2=Decimal("70.00"),
            id_agente_publicador=self.agente,
            creado_por=self.user
        )
        self.contrato = Contrato.objects.create(
            codigo_contrato="CTR-001",
            propiedad=self.propiedad,
            cliente=self.cliente,
            agente=self.agente,
            tipo_operacion="ALQUILER",
            estado_contrato="ACTIVO",
            monto=Decimal("500.00"),
            fecha_inicio=date(2026, 1, 1),
            fecha_fin=date(2026, 12, 31),
            garantia=Decimal("500.00"),
            comision=Decimal("50.00"),
            condiciones="Pagar hasta el dia 5 de cada mes.",
            observaciones="Contrato de prueba."
        )
        self.pago_contrato = PagoContrato.objects.create(
            contrato=self.contrato,
            monto=Decimal("500.00"),
            fecha_vencimiento=date(2026, 2, 1),
            estado="PENDIENTE"
        )

        # Autenticar al usuario y obtener el token JWT
        login_url = reverse('login') # Corregido para usar el nombre de la URL directamente
        response = self.client.post(login_url, {'username': 'testuser', 'password': 'testpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data['token']
        
        # Configurar el cliente para usar el token (como si fuera el frontend)
        # Se asume que CookieJWTAuthentication lee el token de una cookie
        self.client.cookies['access_token'] = self.token
        # DRF-SimpleJWT espera 'Bearer' en el header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')


    @patch('modulo_pagos.views.stripe.checkout.Session.create')
    def test_create_checkout_session_pro_plan(self, mock_session_create):
        mock_session_create.return_value = SimpleNamespace(
            id='cs_plan_test',
            url='https://checkout.stripe.com/pay/cs_plan_test'
        )

        url = reverse('create-checkout-session')
        data = {'plan_id': 'pro'}
        
        response = self.client.post(url, data, format='json')
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)
        self.assertIn('https://checkout.stripe.com', response.data['url'])
        
        # Verificar que se creó un registro de Pago pendiente
        self.assertEqual(self.tenant.pagos.count(), 1)
        pago = self.tenant.pagos.first()
        self.assertEqual(pago.plan_adquirido, 'profesional')
        self.assertEqual(pago.estado, 'pendiente')

    @patch('modulo_pagos.views.stripe.checkout.Session.create')
    def test_create_checkout_session_contrato_pago_pendiente(self, mock_session_create):
        mock_session_create.return_value = SimpleNamespace(
            id='cs_contrato_test',
            url='https://checkout.stripe.com/pay/cs_contrato_test'
        )

        url = reverse('contrato-checkout-session', kwargs={'id_pago': self.pago_contrato.id_pago})

        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)
        self.assertIn('https://checkout.stripe.com', response.data['url'])
        self.assertEqual(self.tenant.pagos.count(), 1)

        pago = self.tenant.pagos.first()
        self.assertEqual(pago.plan_adquirido, 'contrato')
        self.assertEqual(pago.estado, 'pendiente')
        self.assertEqual(pago.pago_contrato, self.pago_contrato)

    @patch('modulo_pagos.views.stripe.checkout.Session.create')
    def test_no_permite_checkout_contrato_pagado(self, mock_session_create):
        self.pago_contrato.estado = "PAGADO"
        self.pago_contrato.fecha_pago = date(2026, 2, 2)
        self.pago_contrato.save()

        url = reverse('contrato-checkout-session', kwargs={'id_pago': self.pago_contrato.id_pago})

        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_session_create.assert_not_called()
        self.assertEqual(self.tenant.pagos.count(), 0)

    def test_criterios_pago_contrato(self):
        url = reverse('contrato-criterios-pago', kwargs={'id_contrato': self.contrato.id_contrato})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['contrato']['codigo_contrato'], 'CTR-001')
        self.assertEqual(response.data['contrato']['condiciones'], 'Pagar hasta el dia 5 de cada mes.')
        self.assertEqual(len(response.data['pagos']), 1)
        self.assertEqual(response.data['pagos'][0]['estado'], 'PENDIENTE')

    @patch('modulo_pagos.views.stripe.Webhook.construct_event')
    def test_webhook_marca_pago_contrato_como_pagado(self, mock_construct_event):
        Pago.objects.create(
            tenant=self.tenant,
            pago_contrato=self.pago_contrato,
            stripe_checkout_id='cs_contrato_webhook',
            monto=self.pago_contrato.monto,
            plan_adquirido='contrato'
        )
        session = SimpleNamespace(
            id='cs_contrato_webhook',
            metadata={'tipo_pago': 'contrato'}
        )
        mock_construct_event.return_value = {
            'type': 'checkout.session.completed',
            'data': {'object': session}
        }

        url = reverse('stripe-webhook')
        response = self.client.post(
            url,
            data=b'{}',
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='firma-test'
        )

        self.assertEqual(response.status_code, 200)
        self.pago_contrato.refresh_from_db()
        pago = Pago.objects.get(stripe_checkout_id='cs_contrato_webhook')
        self.assertEqual(pago.estado, 'completado')
        self.assertEqual(self.pago_contrato.estado, 'PAGADO')
        self.assertEqual(self.pago_contrato.fecha_pago, timezone.now().date())
        self.assertEqual(self.pago_contrato.observaciones, 'Pago realizado por Stripe')

    @patch('modulo_pagos.views.stripe.checkout.Session.retrieve')
    def test_confirmar_pago_contrato_sin_webhook(self, mock_retrieve):
        Pago.objects.create(
            tenant=self.tenant,
            pago_contrato=self.pago_contrato,
            stripe_checkout_id='cs_contrato_confirmar',
            monto=self.pago_contrato.monto,
            plan_adquirido='contrato'
        )
        mock_retrieve.return_value = SimpleNamespace(
            payment_status='paid',
            status='complete'
        )

        url = reverse('contrato-confirmar-pago', kwargs={'id_pago': self.pago_contrato.id_pago})
        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['estado'], 'PAGADO')
        self.pago_contrato.refresh_from_db()
        self.assertEqual(self.pago_contrato.estado, 'PAGADO')
        self.assertEqual(self.pago_contrato.fecha_pago, timezone.now().date())
