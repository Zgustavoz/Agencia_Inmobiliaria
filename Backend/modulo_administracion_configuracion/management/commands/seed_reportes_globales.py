from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from modulo_administracion_configuracion.models import Tenant, Moneda
from modulo_inmuebles.models.zona import Zona
from modulo_inmuebles.models.propiedad import Propiedad
from gestion_usuarios.models import Usuario, Rol, UsuarioRol
from modulo_clientes_seguimiento.models import Cliente
from modulo_contratos.models import Contrato
from modulo_contratos.models.operacion_inmobiliaria import OperacionInmobiliaria


class Command(BaseCommand):
    help = "Seed de datos basicos para reportes globales"

    def handle(self, *args, **options):
        moneda, _ = Moneda.objects.get_or_create(
            codigo="BOB",
            defaults={"nombre": "Boliviano", "simbolo": "Bs", "estado": True},
        )

        zona, _ = Zona.objects.get_or_create(
            zona="Centro",
            defaults={
                "pais": "Bolivia",
                "departamento": "La Paz",
                "provincia": "Murillo",
                "municipio": "La Paz",
                "ciudad": "La Paz",
            },
        )

        for idx in range(1, 3):
            tenant, _ = Tenant.objects.get_or_create(
                nombre=f"Inmobiliaria Demo {idx}",
                defaults={
                    "descripcion": "Tenant demo para reportes",
                    "plan": "basico",
                    "max_propiedades": 50,
                    "estado": True,
                    "fecha_vencimiento_pago": timezone.now().date() + timedelta(days=30),
                },
            )

            admin_user, _ = Usuario.objects.get_or_create(
                username=f"admin_demo_{idx}",
                defaults={
                    "email": f"admin_demo_{idx}@example.com",
                    "nombres": "Admin",
                    "apellidos": f"Demo {idx}",
                    "tenant": tenant,
                    "es_admin": True,
                },
            )

            if not admin_user.has_usable_password():
                admin_user.set_password("password123")
                admin_user.save()

            agente, _ = Usuario.objects.get_or_create(
                username=f"agente_demo_{idx}",
                defaults={
                    "email": f"agente_demo_{idx}@example.com",
                    "nombres": "Agente",
                    "apellidos": f"Demo {idx}",
                    "tenant": tenant,
                },
            )
            if not agente.has_usable_password():
                agente.set_password("password123")
                agente.save()

            cliente_user, _ = Usuario.objects.get_or_create(
                username=f"cliente_demo_{idx}",
                defaults={
                    "email": f"cliente_demo_{idx}@example.com",
                    "nombres": "Cliente",
                    "apellidos": f"Demo {idx}",
                    "tenant": tenant,
                },
            )
            if not cliente_user.has_usable_password():
                cliente_user.set_password("password123")
                cliente_user.save()

            rol_admin = Rol.objects.filter(nombre="Administrador").first()
            if rol_admin:
                UsuarioRol.objects.get_or_create(usuario=admin_user, rol=rol_admin)

            cliente, _ = Cliente.objects.get_or_create(
                tenant=tenant,
                email=f"contacto_demo_{idx}@example.com",
                defaults={
                    "nombres": "Cliente",
                    "apellidos": f"Demo {idx}",
                    "telefono": f"7000000{idx}",
                    "origen": "web",
                    "estado": "activo",
                    "creado_por": admin_user,
                },
            )

            propiedad, _ = Propiedad.objects.get_or_create(
                codigo_propiedad=f"PROP-DEMO-{idx}",
                defaults={
                    "titulo": f"Propiedad Demo {idx}",
                    "id_modalidad": 1,
                    "modalidad_operacion": "Venta",
                    "zona": zona,
                    "moneda": moneda,
                    "tenant": tenant,
                    "precio": 150000 + idx * 1000,
                    "creado_por": admin_user,
                    "estado_propiedad": "Disponible",
                },
            )

            Contrato.objects.get_or_create(
                codigo_contrato=f"CTR-DEMO-{idx}",
                defaults={
                    "propiedad": propiedad,
                    "cliente": cliente_user,
                    "agente": agente,
                    "tipo_operacion": "VENTA",
                    "estado_contrato": "ACTIVO",
                    "monto": 200000 + idx * 2000,
                    "fecha_inicio": date.today() - timedelta(days=30),
                    "fecha_fin": date.today() + timedelta(days=335),
                },
            )

            OperacionInmobiliaria.objects.get_or_create(
                codigo_operacion=f"OP-DEMO-{idx}",
                defaults={
                    "tipo_operacion": "VENTA",
                    "propiedad": propiedad,
                    "cliente": cliente_user,
                    "agente": agente,
                    "monto_operacion": 210000 + idx * 2000,
                    "moneda": moneda,
                    "comision_monto": 5000,
                    "fecha_operacion": date.today() - timedelta(days=15),
                    "estado": "cerrada",
                    "observaciones": "Operacion demo",
                },
            )

        self.stdout.write(self.style.SUCCESS("Seed de reportes globales completado"))
