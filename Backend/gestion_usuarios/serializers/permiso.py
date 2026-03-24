# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from ..models import Permiso

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Permiso
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'estado']
        read_only_fields = ['id']

    def validate_codigo(self, value):
        qs = Permiso.objects.filter(codigo=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ya existe un permiso con este código')
        return value