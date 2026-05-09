# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from ..models.visita import Visita, HorarioDisponibilidad

class HorarioDisponibilidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioDisponibilidad
        fields = '__all__'

class VisitaSerializer(serializers.ModelSerializer):
    propiedad_titulo = serializers.ReadOnlyField(source='propiedad.titulo')
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombres')
    agente_nombre = serializers.ReadOnlyField(source='agente.username')

    class Meta:
        model = Visita
        fields = '__all__'
        read_only_fields = ('creado_en', 'actualizado_en')

    def validate_calificacion(self, value):
        if value and (value < 1 or value > 5):
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value
