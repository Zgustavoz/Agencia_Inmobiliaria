from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from gestion_usuarios.models import Rol

Usuario = get_user_model()

class Command(BaseCommand):
    help = 'Crea o actualiza un Superadmin Global con acceso a todo el sistema'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin_global', help='Username del superadmin')
        parser.add_argument('--email', type=str, default='admin@sistema.com', help='Email del superadmin')
        parser.add_argument('--password', type=str, default='admin123', help='Password del superadmin')
        parser.add_argument('--nombres', type=str, default='Admin', help='Nombres')
        parser.add_argument('--apellidos', type=str, default='Global', help='Apellidos')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        nombres = options['nombres']
        apellidos = options['apellidos']

        self.stdout.write(f"Preparando usuario Superadmin: {username}...")

        # 1. Buscar o Crear el usuario
        user, created = Usuario.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'nombres': nombres,
                'apellidos': apellidos,
                'es_admin': True,
                'estado': True,
                'tenant': None  # Los superadmins globales no pertenecen a un tenant
            }
        )

        # 2. Si ya existía, actualizar datos clave para asegurar acceso
        if not created:
            user.email = email
            user.nombres = nombres
            user.apellidos = apellidos
            user.es_admin = True
            user.estado = True
            user.tenant = None
            self.stdout.write(self.style.WARNING(f"El usuario {username} ya existía. Actualizando credenciales y permisos..."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Usuario {username} creado exitosamente."))

        # 3. Establecer password
        user.set_password(password)
        user.save()

        # 4. Asignar el Rol de Superadmin (asegurarse de que el paso 1 se haya ejecutado)
        try:
            rol_superadmin = Rol.objects.get(nombre="Superadmin")
            # Usamos set() para limpiar roles anteriores y dejar solo este en caso de re-ejecución
            from gestion_usuarios.models import UsuarioRol
            UsuarioRol.objects.filter(usuario=user).delete()
            UsuarioRol.objects.create(usuario=user, rol=rol_superadmin)
            self.stdout.write(self.style.SUCCESS(f"Rol 'Superadmin' asignado correctamente a {username}."))
        except Rol.DoesNotExist:
            self.stdout.write(self.style.ERROR("Error: El rol 'Superadmin' no existe. Ejecuta primero 'python Backend/manage.py setup_superadmin'"))

        self.stdout.write(self.style.SUCCESS(f"--- LISTO ---"))
        self.stdout.write(f"Username: {username}")
        self.stdout.write(f"Password: {password}")
        self.stdout.write(self.style.MIGRATE_LABEL("Ya puedes iniciar sesión como Administrador Global."))
