from rest_framework import serializers
from modulo_contratos.models.operacion_inmobiliaria import OperacionInmobiliaria


class ReporteOperacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    propiedad_codigo = serializers.ReadOnlyField(source="propiedad.codigo_propiedad")
    moneda_codigo = serializers.ReadOnlyField(source="moneda.codigo")

    class Meta:
        model = OperacionInmobiliaria
        fields = [
            "id_operacion",
            "codigo_operacion",
            "tipo_operacion",
            "fecha_operacion",
            "estado",
            "monto_operacion",
            "moneda_codigo",
            "cliente_nombre",
            "propiedad_codigo",
        ]

    def get_cliente_nombre(self, obj):
        return f"{obj.cliente.nombres} {obj.cliente.apellidos}".strip()
