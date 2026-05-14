from django.core.management.base import BaseCommand
from django.db import transaction

from gestion_usuarios.models import Rol, Usuario
from modulo_administracion_configuracion.models import Tenant
from modulo_clientes_seguimiento.models import Cliente


class Command(BaseCommand):
    help = "Crea un cliente demo con usuario para login en la app mobile"

    DEFAULT_TENANT_ID = 1
    DEFAULT_USERNAME = "cliente.mobile.demo"
    DEFAULT_EMAIL = "cliente.mobile.demo@gmail.com"
    DEFAULT_PASSWORD = "Cliente123#"

    def add_arguments(self, parser):
        parser.add_argument(
            "--tenant-id",
            type=int,
            default=self.DEFAULT_TENANT_ID,
            help="Tenant donde se creara el usuario y cliente demo",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        tenant = self._obtener_tenant(options["tenant_id"])
        rol_cliente = self._obtener_rol_cliente()
        creado_por = self._obtener_creado_por(tenant)

        usuario = self._crear_o_actualizar_usuario(tenant, rol_cliente)
        cliente = self._crear_o_actualizar_cliente(tenant, usuario, creado_por)

        self.stdout.write(self.style.SUCCESS("Cliente mobile demo listo"))
        self.stdout.write(f"  Tenant: {tenant.id} - {tenant.nombre}")
        self.stdout.write(f"  Usuario: {usuario.username}")
        self.stdout.write(f"  Email: {usuario.email}")
        self.stdout.write(f"  Password: {self.DEFAULT_PASSWORD}")
        self.stdout.write(f"  Cliente: {cliente.id} - {cliente.codigo_cliente}")

    def _obtener_tenant(self, tenant_id):
        tenant = Tenant.objects.filter(id=tenant_id).first()
        if tenant:
            return tenant

        tenant = Tenant.objects.filter(estado=True).order_by("id").first()
        if tenant:
            self.stdout.write(
                self.style.WARNING(
                    f"No existe tenant_id={tenant_id}; usando tenant_id={tenant.id}."
                )
            )
            return tenant

        return Tenant.objects.create(
            nombre="Inmobiliaria Demo",
            descripcion="Tenant demo para cliente mobile",
            estado=True,
        )

    def _obtener_rol_cliente(self):
        rol, _ = Rol.objects.get_or_create(
            nombre="Cliente",
            defaults={"descripcion": "Acceso de clientes a la app mobile"},
        )
        return rol

    def _obtener_creado_por(self, tenant):
        return (
            Usuario.objects.filter(tenant=tenant, es_admin=True).first()
            or Usuario.objects.filter(tenant=tenant).first()
        )

    def _crear_o_actualizar_usuario(self, tenant, rol_cliente):
        usuario, _ = Usuario.objects.get_or_create(
            username=self.DEFAULT_USERNAME,
            defaults={
                "email": self.DEFAULT_EMAIL,
                "nombres": "Cliente",
                "apellidos": "Mobile Demo",
                "telefono": "79990001",
                "estado": True,
                "tenant": tenant,
            },
        )

        usuario.email = self.DEFAULT_EMAIL
        usuario.nombres = "Cliente"
        usuario.apellidos = "Mobile Demo"
        usuario.telefono = "79990001"
        usuario.estado = True
        usuario.tenant = tenant
        usuario.set_password(self.DEFAULT_PASSWORD)
        usuario.save()
        usuario.roles.add(rol_cliente)
        return usuario

    def _crear_o_actualizar_cliente(self, tenant, usuario, creado_por):
        cliente, _ = Cliente.objects.get_or_create(
            tenant=tenant,
            email=self.DEFAULT_EMAIL,
            defaults={
                "tipo_documento": "CI",
                "nro_documento": "9990001",
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos,
                "telefono": usuario.telefono,
                "whatsapp": usuario.telefono,
                "direccion": "Santa Cruz de la Sierra",
                "ocupacion": "Cliente demo",
                "origen": "movil",
                "estado": "nuevo",
                "observaciones": "Cliente demo creado para probar agenda de visitas desde mobile.",
                "usuario": usuario,
                "creado_por": creado_por,
            },
        )

        cliente.usuario = usuario
        cliente.tipo_documento = "CI"
        cliente.nro_documento = "9990001"
        cliente.nombres = usuario.nombres
        cliente.apellidos = usuario.apellidos
        cliente.telefono = usuario.telefono
        cliente.whatsapp = usuario.telefono
        cliente.direccion = "Santa Cruz de la Sierra"
        cliente.ocupacion = "Cliente demo"
        cliente.origen = "movil"
        cliente.estado = "nuevo"
        cliente.tenant = tenant
        cliente.creado_por = creado_por
        cliente.save()
        return cliente
