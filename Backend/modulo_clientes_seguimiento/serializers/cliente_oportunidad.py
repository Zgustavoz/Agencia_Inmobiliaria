from rest_framework import serializers
from ..models.cliente_oportunidad import ClienteOportunidad


class ClienteOportunidadSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre_completo', read_only=True)
    etapa_display = serializers.CharField(source='get_etapa_display', read_only=True)

    class Meta:
        model = ClienteOportunidad
        fields = [
            'id',
            'cliente',
            'cliente_nombre',
            'agente',
            'nombre',
            'descripcion',
            'etapa',
            'etapa_display',
            'valor_estimado',
            'probabilidad',
            'fecha_cierre_est',
            'creado_en',
            'actualizado_en',
        ]
