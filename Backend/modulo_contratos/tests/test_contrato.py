from django.test import TestCase
from datetime import date

from gestion_usuarios.models import Rol, Usuario
from modulo_administracion_configuracion.models import Tenant, Moneda
from modulo_inmuebles.models import Zona, Propiedad
from modulo_contratos.models import Contrato
from modulo_contratos.serializers.contrato import ContratoSerializer


class ContratoInspectionTests(TestCase):

    def setUp(self):
        # Roles
        self.rol_cliente = Rol.objects.create(nombre='Cliente')
        self.rol_agente = Rol.objects.create(nombre='Agente')

        # Usuarios
        self.cliente = Usuario.objects.create_user(
            username='cliente1',
            email='cliente1@example.com',
            password='pass',
            nombres='Cliente',
            apellidos='Uno',
            estado=True
        )
        self.cliente.roles.add(self.rol_cliente)

        self.agente = Usuario.objects.create_user(
            username='agente1',
            email='agente1@example.com',
            password='pass',
            nombres='Agente',
            apellidos='Uno',
            estado=True
        )
        self.agente.roles.add(self.rol_agente)

        # Ubicación / moneda / tenant
        self.zona = Zona.objects.create(zona='Centro', ciudad='La Paz')
        self.moneda = Moneda.objects.create(codigo='BOB', nombre='Boliviano', simbolo='Bs.', estado=True)
        self.tenant = Tenant.objects.create(nombre='T1')

        # Propiedad
        self.propiedad = Propiedad.objects.create(
            codigo_propiedad='P-001',
            titulo='Depto prueba',
            id_modalidad=1,
            zona=self.zona,
            moneda=self.moneda,
            tenant=self.tenant,
            precio=1000,
        )

    def test_serializer_includes_related_fields_and_estado_calculado(self):
        contrato = Contrato.objects.create(
            codigo_contrato='C-DET-1',
            propiedad=self.propiedad,
            cliente=self.cliente,
            agente=self.agente,
            tipo_operacion='ALQUILER',
            estado_contrato='ACTIVO',
            monto=1500,
            fecha_inicio=date(2026, 6, 1),
            fecha_fin=date(2027, 6, 1),
        )

        serializer = ContratoSerializer(contrato)
        data = serializer.data

        self.assertIn('cliente_nombre_completo', data)
        self.assertIn('agente_nombre_completo', data)
        self.assertIn('propiedad_nombre', data)
        self.assertIn('estado_real', data)
        self.assertEqual(data['cliente_nombre_completo'], f"{self.cliente.nombres} {self.cliente.apellidos}")
        self.assertEqual(data['agente_nombre_completo'], f"{self.agente.nombres} {self.agente.apellidos}")

    def test_prevent_overlapping_contracts_for_same_property(self):
        # Contrato existente
        Contrato.objects.create(
            codigo_contrato='C-EX-1',
            propiedad=self.propiedad,
            cliente=self.cliente,
            agente=self.agente,
            tipo_operacion='ALQUILER',
            estado_contrato='ACTIVO',
            monto=1000,
            fecha_inicio=date(2026, 1, 1),
            fecha_fin=date(2026, 12, 31),
        )

        # Intento crear contrato que se solapa
        data = {
            'codigo_contrato': 'C-NEW-1',
            'propiedad': self.propiedad.id_propiedad,
            'cliente': self.cliente.id,
            'agente': self.agente.id,
            'tipo_operacion': 'ALQUILER',
            'monto': '1200.00',
            'fecha_inicio': '2026-06-01',
            'fecha_fin': '2026-11-01'
        }

        serializer = ContratoSerializer(data=data)
        valid = serializer.is_valid()

        self.assertFalse(valid)
        # error debe mencionar superposición
        errors = serializer.errors
        non_field = errors.get('non_field_errors') or errors.get('detail') or errors
        found = False
        if isinstance(non_field, (list, tuple)):
            text = ' '.join(str(x) for x in non_field)
        else:
            text = str(non_field)
        self.assertIn('superpone', text.lower())
