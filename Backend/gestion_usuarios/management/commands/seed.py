# pylint: disable=C0114,C0115,C0116
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from gestion_usuarios.models import Rol, Permiso, Usuario
from modulo_administracion_configuracion.models import Moneda, Tenant
from modulo_contratos.models import Contrato, PagoContrato
from modulo_inmuebles.models import Propiedad, Zona

class Command(BaseCommand):
    help = 'Carga datos iniciales del sistema'

    def handle(self, *args, **kwargs):
        self._crear_permisos()
        self._crear_roles()
        self._crear_admin()
        self._crear_agente()
        self._crear_cliente()
        self._crear_datos_contratos()
        self.stdout.write(self.style.SUCCESS('Seed ejecutado correctamente'))

    def _crear_permisos(self):
        permisos = [
            ('crear',         'Crear registros'),
            ('editar',        'Editar registros'),
            ('eliminar',      'Eliminar registros'),
            ('visualizar',    'Visualizar registros'),
            ('cambiar_estado','Cambiar estado de registros'),
            ('exportar',      'Exportar registros'),
        ]
        for codigo, nombre in permisos:
            Permiso.objects.get_or_create(
                codigo=codigo,
                defaults={'nombre': nombre}
            )
        self.stdout.write('  Permisos creados')

    def _crear_roles(self):
        roles = [
            ('Administrador', 'Acceso total al sistema',      True),
            ('Agente',        'Gestión de propiedades',       False),
            ('Cliente',       'Acceso a búsqueda y reservas', False),
        ]
        todos_los_permisos = list(Permiso.objects.all())
        for nombre, descripcion, es_todos in roles:
            rol, _ = Rol.objects.get_or_create(
                nombre=nombre,
                defaults={'descripcion': descripcion}
            )
            if es_todos:
                rol.permisos.set(todos_los_permisos)
        self.stdout.write('  Roles creados')

    def _crear_admin(self):
        if not Usuario.objects.filter(username='admin').exists():
            admin = Usuario.objects.create_superuser(
                username  = 'admin',
                email     = 'admin@inmobiliaria.com',
                password  = 'Admin123#',
                nombres   = 'Administrador',
                apellidos = 'Sistema',
                es_admin  = True,
            )
            rol_admin = Rol.objects.get(nombre='Administrador')
            admin.roles.set([rol_admin])
            self.stdout.write('  Admin creado')
        else:
            self.stdout.write('  Admin ya existe')

    def _crear_cliente(self):
        if not Usuario.objects.filter(username='cliente').exists():
            cliente = Usuario.objects.create_user(
                username='cliente',
                email='cliente@test.com',
                password='Cliente123#',
                nombres='Carlos',
                apellidos='Mendoza'
            )

            rol_cliente = Rol.objects.get(nombre='Cliente')
            cliente.roles.add(rol_cliente)

            self.stdout.write('  Cliente creado')
        else:
            self.stdout.write('  Cliente ya existe')

    
    def _crear_agente(self):
        if not Usuario.objects.filter(username='agente').exists():
            agente = Usuario.objects.create_user(
                username='agente',
                email='agente@test.com',
                password='Agente123#',
                nombres='Laura',
                apellidos='Fernandez'
            )

            rol_agente = Rol.objects.get(nombre='Agente')
            agente.roles.add(rol_agente)

            self.stdout.write('  Agente creado')
        else:
            self.stdout.write('  Agente ya existe')

    def _crear_datos_contratos(self):
        tenant, _ = Tenant.objects.get_or_create(
            nombre='Inmobiliaria Demo',
            defaults={
                'descripcion': 'Tenant demo para probar contratos y pagos',
                'estado': True,
                'fecha_vencimiento_pago': timezone.now().date() + timedelta(days=365),
                'plan': 'profesional',
                'max_propiedades': 50,
            }
        )

        admin = Usuario.objects.get(username='admin')
        agente = Usuario.objects.get(username='agente')
        cliente = Usuario.objects.get(username='cliente')

        for usuario in [admin, agente, cliente]:
            if usuario.tenant_id != tenant.id:
                usuario.tenant = tenant
                usuario.save(update_fields=['tenant'])

        moneda, _ = Moneda.objects.get_or_create(
            codigo='USD',
            defaults={
                'nombre': 'Dolar estadounidense',
                'simbolo': '$',
                'estado': True,
            }
        )

        zona, _ = Zona.objects.get_or_create(
            zona='Centro Empresarial',
            ciudad='Santa Cruz',
            defaults={
                'pais': 'Bolivia',
                'departamento': 'Santa Cruz',
                'municipio': 'Santa Cruz de la Sierra',
                'referencia': 'Zona demo para contratos',
            }
        )

        propiedad, _ = Propiedad.objects.update_or_create(
            codigo_propiedad='PROP-CONTRATO-001',
            defaults={
                'titulo': 'Departamento Demo con Contrato',
                'descripcion': 'Propiedad creada por seed para probar Mis Contratos en mobile.',
                'tipo_inmueble': 'Departamento',
                'id_modalidad': 1,
                'modalidad_operacion': 'Alquiler',
                'zona': zona,
                'moneda': moneda,
                'tenant': tenant,
                'precio': Decimal('500.00'),
                'expensas': Decimal('30.00'),
                'comision_pct': Decimal('10.00'),
                'superficie_total_m2': Decimal('85.00'),
                'superficie_construida_m2': Decimal('75.00'),
                'ambientes': 4,
                'dormitorios': 2,
                'banos': 2,
                'garajes': 1,
                'amoblado': True,
                'servicios_basicos': 'Agua, luz, gas e internet',
                'caracteristicas_adicionales': 'Cerca de colegios y supermercados',
                'estado_propiedad': 'Alquilada',
                'publicado_web': True,
                'publicado_movil': True,
                'destacada': True,
                'promocionada': False,
                'id_agente_publicador': agente,
                'creado_por': admin,
            }
        )

        contrato, created = Contrato.objects.update_or_create(
            codigo_contrato='CTR-MOBILE-001',
            defaults={
                'propiedad': propiedad,
                'cliente': cliente,
                'agente': agente,
                'tipo_operacion': 'ALQUILER',
                'estado_contrato': 'ACTIVO',
                'monto': Decimal('500.00'),
                'fecha_inicio': date(2026, 6, 1),
                'fecha_fin': date(2027, 6, 1),
                'garantia': Decimal('500.00'),
                'comision': Decimal('50.00'),
                'condiciones': 'El pago debe realizarse hasta el dia 5 de cada mes.',
                'observaciones': 'Contrato demo para visualizar pagos pendientes en la app movil.',
            }
        )

        pagos = [
            (date(2026, 6, 5), 'PAGADO', date(2026, 6, 3), 'Pago inicial registrado por seed.'),
            (date(2026, 7, 5), 'PENDIENTE', None, 'Cuota pendiente para prueba mobile.'),
            (date(2026, 8, 5), 'PENDIENTE', None, 'Segunda cuota pendiente para prueba mobile.'),
        ]

        for fecha_vencimiento, estado, fecha_pago, observaciones in pagos:
            PagoContrato.objects.update_or_create(
                contrato=contrato,
                fecha_vencimiento=fecha_vencimiento,
                defaults={
                    'monto': Decimal('500.00'),
                    'estado': estado,
                    'fecha_pago': fecha_pago,
                    'observaciones': observaciones,
                }
            )

        if created:
            self.stdout.write('  Contrato demo creado con cuotas pendientes')
        else:
            self.stdout.write('  Contrato demo ya existe; cuotas verificadas')
