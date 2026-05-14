from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from gestion_usuarios.models import Usuario, Rol
from modulo_administracion_configuracion.models import Tenant
from django.utils import timezone
from datetime import timedelta
import json

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


    def test_create_checkout_session_pro_plan(self):
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
