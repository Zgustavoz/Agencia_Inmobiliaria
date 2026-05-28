from rest_framework import serializers
from ..models import Cliente


class ReporteClienteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = [
            "id",
            "codigo_cliente",
            "nombre_completo",
            "email",
            "telefono",
            "estado",
            "origen",
            "creado_en",
        ]

    def get_nombre_completo(self, obj):
        return f"{obj.nombres} {obj.apellidos}".strip()
