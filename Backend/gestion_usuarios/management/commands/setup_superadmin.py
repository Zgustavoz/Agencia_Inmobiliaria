from django.core.management.base import BaseCommand
from gestion_usuarios.models import Rol, Permiso

class Command(BaseCommand):
    help = 'Configura el rol de Superadmin y sus permisos específicos'

    def handle(self, *args, **options):
        self.stdout.write("Configurando permisos de Superadmin...")

        # 1. Crear permisos específicos para gestión global
        permisos_data = [
            {
                "codigo": "gestionar_tenants",
                "nombre": "Puede crear, editar y suspender tenants",
                "descripcion": "Acceso total a la gestión de empresas (inquilinos)"
            },
            {
                "codigo": "ver_estadisticas_globales",
                "nombre": "Puede ver estadísticas de todos los tenants",
                "descripcion": "Acceso a métricas agregadas de todo el sistema"
            },
            {
                "codigo": "gestionar_suscripciones",
                "nombre": "Puede gestionar planes y pagos",
                "descripcion": "Control sobre vencimientos y límites de planes"
            }
        ]

        permisos_objetos = []
        for p in permisos_data:
            permiso, created = Permiso.objects.update_or_create(
                codigo=p["codigo"],
                defaults={
                    "nombre": p["nombre"],
                    "descripcion": p["descripcion"],
                    "estado": True
                }
            )
            permisos_objetos.append(permiso)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Permiso creado: {p['codigo']}"))
            else:
                self.stdout.write(f"Permiso actualizado: {p['codigo']}")

        # 2. Crear el Rol Superadmin
        rol_superadmin, created = Rol.objects.update_or_create(
            nombre="Superadmin",
            defaults={
                "descripcion": "Administrador Global del Sistema - Acceso a todos los tenants",
                "estado": True
            }
        )

        # 3. Asignar todos los permisos al Superadmin
        # (Incluyendo los nuevos y los existentes para que tenga control total)
        todos_los_permisos = Permiso.objects.filter(estado=True)
        rol_superadmin.permisos.set(todos_los_permisos)

        if created:
            self.stdout.write(self.style.SUCCESS("Rol 'Superadmin' creado con éxito."))
        else:
            self.stdout.write("Rol 'Superadmin' actualizado con todos los permisos.")

        self.stdout.write(self.style.SUCCESS("Configuración completada."))
