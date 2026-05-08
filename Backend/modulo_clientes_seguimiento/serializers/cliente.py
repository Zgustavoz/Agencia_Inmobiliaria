# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from ..models.cliente import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.ReadOnlyField(source='creado_por.username')

    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ('creado_en', 'actualizado_en', 'creado_por')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['creado_por'] = request.user
        return super().create(validated_data)
