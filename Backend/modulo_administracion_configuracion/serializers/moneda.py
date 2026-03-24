from rest_framework import serializers
from ..models.moneda import Moneda


class MonedaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moneda
        fields = ['id_moneda', 'codigo', 'nombre', 'simbolo', 'estado']

    def validate_codigo(self, value):
        if not value.strip():
            raise serializers.ValidationError("El código no puede estar vacío.")
        return value.upper().strip()

    def validate_nombre(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value.strip()

    def validate_simbolo(self, value):
        if not value.strip():
            raise serializers.ValidationError("El símbolo no puede estar vacío.")
        return value.strip()