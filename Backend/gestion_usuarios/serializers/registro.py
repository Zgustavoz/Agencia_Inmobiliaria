# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol
from modulo_clientes_seguimiento.models import Cliente
from modulo_administracion_configuracion.models import Tenant

class RegistroSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    tenant_id = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model  = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password', 'password2', 'tenant_id'
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        tenant_id = validated_data.pop('tenant_id', None)
        
        # Si no viene tenant_id, intentar buscar el primero activo como fallback
        if not tenant_id:
            t = Tenant.objects.filter(estado=True).order_by('id').first()
            if t:
                tenant_id = t.id

        user = Usuario.objects.create_user(password=password, tenant_id=tenant_id, **validated_data)

        # Asignar rol Cliente por defecto
        try:
            rol_cliente = Rol.objects.get(nombre='Cliente')
            user.roles.set([rol_cliente])
        except Rol.DoesNotExist:
            pass

        return user


class RegistroAgenteSerializer(serializers.ModelSerializer):
    password_hash = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    role = serializers.ChoiceField(
        choices=['agent', 'admin'],
        default='agent',
        required=False
    )
    foto_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tenant_id = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password_hash', 'foto_url', 'role', 'tenant_id'
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'agent')
        password = validated_data.pop('password_hash')
        tenant_id = validated_data.pop('tenant_id', None)

        # Fallback de tenant
        if not tenant_id:
            t = Tenant.objects.filter(estado=True).order_by('id').first()
            if t:
                tenant_id = t.id

        user = Usuario.objects.create_user(password=password, tenant_id=tenant_id, **validated_data)

        role_name = 'Administrador' if role == 'admin' else 'Agente'
        try:
            rol = Rol.objects.get(nombre=role_name)
            user.roles.set([rol])
            if role == 'admin':
                user.es_admin = True
                user.save(update_fields=['es_admin'])
        except Rol.DoesNotExist:
            pass

        return user

class RegistroClienteSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    # Campos adicionales para la tabla Cliente
    ci               = serializers.CharField(required=False, allow_blank=True)
    direccion        = serializers.CharField(required=False, allow_blank=True)
    ocupacion        = serializers.CharField(required=False, allow_blank=True)
    fecha_nacimiento = serializers.DateField(required=False, allow_null=True)
    telefono         = serializers.CharField(required=False, allow_blank=True)
    whatsapp         = serializers.CharField(required=False, allow_blank=True)
    tenant_id        = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model  = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password', 'password2',
            'ci', 'direccion', 'ocupacion', 'fecha_nacimiento', 'whatsapp', 'tenant_id'
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return attrs

    def create(self, validated_data):
        # Extraer datos específicos para la tabla Cliente
        ci = validated_data.pop('ci', None)
        direccion = validated_data.pop('direccion', None)
        ocupacion = validated_data.pop('ocupacion', None)
        fecha_nacimiento = validated_data.pop('fecha_nacimiento', None)
        whatsapp = validated_data.pop('whatsapp', None)
        tenant_id = validated_data.pop('tenant_id', None)
        
        # Fallback de tenant
        if not tenant_id:
            t = Tenant.objects.filter(estado=True).order_by('id').first()
            if t:
                tenant_id = t.id
        
        # Quitamos password2 porque create_user no lo usa
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # 1. Crear el Usuario (para el login)
        user = Usuario.objects.create_user(password=password, tenant_id=tenant_id, **validated_data)
        
        # Asignar rol Cliente por defecto
        try:
            rol_cliente = Rol.objects.get(nombre='Cliente')
            user.roles.set([rol_cliente])
        except Rol.DoesNotExist:
            pass

        # 2. Crear la ficha en la tabla Cliente (para el CRM) y vincularlo
        Cliente.objects.create(
            tenant_id=tenant_id,
            usuario=user,
            nombres=user.nombres,
            apellidos=user.apellidos,
            email=user.email,
            telefono=user.telefono,
            whatsapp=whatsapp,
            nro_documento=ci,
            tipo_documento='CI',
            direccion=direccion,
            ocupacion=ocupacion,
            fecha_nacimiento=fecha_nacimiento,
            origen='movil',
            estado='nuevo'
        )

        return user

