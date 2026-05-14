# pylint: disable=C0114,C0115,C0116
from django.core.management.base import BaseCommand
from gestion_usuarios.models import Rol, Permiso, Usuario

class Command(BaseCommand):
    help = 'Carga datos iniciales del sistema'

    def handle(self, *args, **kwargs):
        self._crear_permisos()
        self._crear_roles()
        self._crear_admin()
        self._crear_agente()
        self._crear_cliente()
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