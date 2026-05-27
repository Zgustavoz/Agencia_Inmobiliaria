# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from ..models import Tenant
from modulo_inmuebles.models import Propiedad
from modulo_clientes_seguimiento.models import Cliente
from django.contrib.auth import get_user_model

Usuario = get_user_model()

class TenantSerializer(serializers.ModelSerializer):
    plan_display = serializers.CharField(source='get_plan_display', read_only=True)
    vencido = serializers.SerializerMethodField()
    puede_crear_propiedad = serializers.SerializerMethodField()
    
    class Meta:
        model = Tenant
        fields = [
            'id',
            'nombre',
            'descripcion',
            'estado',
            'fecha_vencimiento_pago',
            'plan',
            'plan_display',
            'max_propiedades',
            'vencido',
            'puede_crear_propiedad',
            'creado_en',
            'actualizado_en',
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en']
    
    def get_vencido(self, obj):
        return obj.esta_vencido()
    
    def get_puede_crear_propiedad(self, obj):
        return obj.puede_crear_propiedad()


class SuperAdminTenantSerializer(TenantSerializer):
    """
    Serializer extendido para el Dashboard de Superadmin.
    Incluye conteos de recursos por tenant.
    """
    total_propiedades = serializers.IntegerField(read_only=True)
    total_clientes = serializers.IntegerField(read_only=True)
    total_usuarios = serializers.IntegerField(read_only=True)

    class Meta(TenantSerializer.Meta):
        fields = TenantSerializer.Meta.fields + [
            'total_propiedades',
            'total_clientes',
            'total_usuarios',
        ]


class UsuarioSimpleSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'nombres', 'apellidos', 'es_admin', 'rol_nombre']

    def get_rol_nombre(self, obj):
        rol = obj.roles.first()
        return rol.nombre if rol else "Sin Rol"


class PropiedadSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = ['id_propiedad', 'titulo', 'precio', 'estado_propiedad', 'creado_en']


class SuperAdminTenantDetailSerializer(SuperAdminTenantSerializer):
    """
    Serializer para el detalle profundo de un Tenant.
    Incluye la lista de usuarios y las propiedades más recientes.
    """
    usuarios_lista = UsuarioSimpleSerializer(source='usuarios', many=True, read_only=True)
    propiedades_recientes = serializers.SerializerMethodField()

    class Meta(SuperAdminTenantSerializer.Meta):
        fields = SuperAdminTenantSerializer.Meta.fields + [
            'usuarios_lista',
            'propiedades_recientes',
        ]

    def get_propiedades_recientes(self, obj):
        # Obtenemos solo las últimas 5 propiedades para no sobrecargar
        recent = obj.propiedades.all().order_by('-creado_en')[:5]
        return PropiedadSimpleSerializer(recent, many=True).data


class TenantProvisioningSerializer(serializers.Serializer):
    """
    Serializer para crear un Tenant y su Usuario Administrador inicial en un solo paso.
    """
    # Datos del Tenant
    tenant_nombre = serializers.CharField(max_length=255)
    tenant_descripcion = serializers.CharField(required=False, allow_blank=True)
    tenant_plan = serializers.ChoiceField(choices=[('basico', 'Básico'), ('profesional', 'Profesional'), ('empresa', 'Empresa')])
    tenant_max_propiedades = serializers.IntegerField(default=3)
    
    # Datos del Admin
    admin_username = serializers.CharField(max_length=50)
    admin_email = serializers.EmailField()
    admin_password = serializers.CharField(write_only=True)
    admin_nombres = serializers.CharField(max_length=100)
    admin_apellidos = serializers.CharField(max_length=100)

    def validate_tenant_nombre(self, value):
        if Tenant.objects.filter(nombre=value).exists():
            raise serializers.ValidationError("Ya existe una empresa con este nombre.")
        return value

    def validate_admin_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("El nombre de usuario ya está en uso.")
        return value

    def validate_admin_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya está registrado.")
        return value
