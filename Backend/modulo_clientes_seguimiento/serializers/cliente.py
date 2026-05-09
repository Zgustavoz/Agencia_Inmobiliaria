# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from ..models.cliente import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.ReadOnlyField(source='creado_por.username')

    class Meta:
        model = Cliente
        fields = [
            'id_cliente', 'codigo_cliente', 'tipo_documento', 'nro_documento',
            'nombres', 'apellidos', 'fecha_nacimiento', 'email', 'telefono',
            'whatsapp', 'direccion', 'ocupacion', 'origen', 'observaciones',
            'estado_cliente', 'creado_por', 'creado_por_nombre', 'creado_en', 'actualizado_en'
        ]
        read_only_fields = ('creado_en', 'actualizado_en', 'creado_por')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['creado_por'] = request.user
        return super().create(validated_data)
