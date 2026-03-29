# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol, Permiso
from .rol import RolSerializer

class UsuarioSerializer(serializers.ModelSerializer):
    roles_info       = RolSerializer(source='roles', many=True, read_only=True)
    roles_ids        = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.filter(estado=True),
        many=True,
        write_only=True,
        source='roles',
        required=False
    )
    password         = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password]
    )
    permisos         = serializers.SerializerMethodField()
    permisos_codigos = serializers.SerializerMethodField()

    class Meta:
        model  = Usuario
        fields = [
            'id', 'username', 'email', 'nombres', 'apellidos',
            'telefono', 'foto_url', 'estado', 'es_admin',
            'es_online', 'ultimo_acceso', 'creado_en', 'actualizado_en',
            'roles', 'roles_info', 'roles_ids',
            'password', 'permisos', 'permisos_codigos',
        ]
        read_only_fields = [
            'id', 'creado_en', 'actualizado_en',
            'es_online', 'ultimo_acceso',
            'permisos', 'permisos_codigos',
        ]

    def get_permisos(self, obj):
        return obj.get_permisos()

    def get_permisos_codigos(self, obj):
        if obj.es_admin:
            return list(Permiso.objects.filter(estado=True).values_list('codigo', flat=True))
        return list(
            obj.roles.filter(estado=True)
            .values_list('permisos__codigo', flat=True)
            .distinct()
            .exclude(permisos__codigo=None)
        )

    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])
        password   = validated_data.pop('password', None)
        user       = Usuario.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
        if roles_data:
            user.roles.set(roles_data)
        user.save()
        return user

    def update(self, instance, validated_data):
        roles_data = validated_data.pop('roles', None)
        password   = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        if roles_data is not None:
            instance.roles.set(roles_data)
        instance.save()
        return instance
