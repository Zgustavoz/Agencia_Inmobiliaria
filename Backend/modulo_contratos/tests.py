from datetime import date
from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone

from gestion_usuarios.models import Rol, Usuario
from modulo_administracion_configuracion.models import Moneda, Tenant
from modulo_contratos.models import Contrato
from modulo_inmuebles.models import Propiedad, Zona


class ContratoNotificationTests(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            nombre="Tenant Contratos",
            plan="profesional",
            max_propiedades=50,
            estado=True,
            fecha_vencimiento_pago=timezone.now().date(),
        )
        rol_cliente = Rol.objects.create(nombre="Cliente")
        rol_agente = Rol.objects.create(nombre="Agente")
        self.cliente = Usuario.objects.create_user(
            username="cliente_contrato",
            email="cliente_contrato@test.com",
            password="Cliente123#",
            nombres="Carlos",
            apellidos="Mendoza",
            tenant=self.tenant,
        )
        self.cliente.roles.add(rol_cliente)
        self.agente = Usuario.objects.create_user(
            username="agente_contrato",
            email="agente_contrato@test.com",
            password="Agente123#",
            nombres="Laura",
            apellidos="Fernandez",
            tenant=self.tenant,
        )
        self.agente.roles.add(rol_agente)
        self.moneda = Moneda.objects.create(
            codigo="USD",
            nombre="Dolar",
            simbolo="$",
            estado=True,
        )
        self.zona = Zona.objects.create(
            pais="Bolivia",
            ciudad="Santa Cruz",
            zona="Centro",
        )
        self.propiedad = Propiedad.objects.create(
            codigo_propiedad="PROP-NOTIF-001",
            titulo="Departamento Notificacion",
            id_modalidad=1,
            modalidad_operacion="Alquiler",
            zona=self.zona,
            moneda=self.moneda,
            tenant=self.tenant,
            precio=Decimal("500.00"),
            superficie_total_m2=Decimal("80.00"),
            superficie_construida_m2=Decimal("70.00"),
            id_agente_publicador=self.agente,
            creado_por=self.agente,
        )

    @patch("modulo_contratos.signals.FirebaseService.send_topic_notification")
    def test_crear_contrato_envia_notificacion_push_al_cliente(self, mock_send):
        contrato = Contrato.objects.create(
            codigo_contrato="CTR-NOTIF-001",
            propiedad=self.propiedad,
            cliente=self.cliente,
            agente=self.agente,
            tipo_operacion="ALQUILER",
            estado_contrato="ACTIVO",
            monto=Decimal("500.00"),
            fecha_inicio=date(2026, 6, 1),
            fecha_fin=date(2027, 6, 1),
            garantia=Decimal("500.00"),
            comision=Decimal("50.00"),
            condiciones="Contrato de prueba para notificacion.",
        )

        mock_send.assert_called_once()
        kwargs = mock_send.call_args.kwargs
        self.assertEqual(kwargs["topic"], "clientes")
        self.assertIn(contrato.codigo_contrato, kwargs["body"])
        self.assertEqual(kwargs["data"]["tipo"], "contrato_creado")
