# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from ..models import Rol, Permiso

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Permiso
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'estado']
        read_only_fields = ['id']

class RolSerializer(serializers.ModelSerializer):
    permisos_info = PermisoSerializer(source='permisos', many=True, read_only=True)
    permisos_ids  = serializers.PrimaryKeyRelatedField(
        queryset=Permiso.objects.filter(estado=True),
        many=True,
        write_only=True,
        source='permisos',
        required=False
    )
    usuarios_count = serializers.IntegerField(source='usuarios.count', read_only=True)

    class Meta:
        model  = Rol
        fields = [
            'id', 'nombre', 'descripcion', 'estado',
            'creado_en', 'usuarios_count',
            'permisos_info', 'permisos_ids',
        ]
        read_only_fields = ['id', 'creado_en', 'usuarios_count']

    def validate_nombre(self, value):
        qs = Rol.objects.filter(nombre=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ya existe un rol con este nombre')
        return value

    def create(self, validated_data):
        permisos_data = validated_data.pop('permisos', [])
        rol = Rol.objects.create(**validated_data)
        if permisos_data:
            rol.permisos.set(permisos_data)
        rol.save()
        return rol

    def update(self, instance, validated_data):
        permisos_data = validated_data.pop('permisos', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if permisos_data is not None:
            instance.permisos.set(permisos_data)
        instance.save()
        return instance
