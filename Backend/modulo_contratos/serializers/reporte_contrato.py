from rest_framework import serializers
from modulo_contratos.models import Contrato


class ReporteContratoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    propiedad_codigo = serializers.ReadOnlyField(source="propiedad.codigo_propiedad")

    class Meta:
        model = Contrato
        fields = [
            "id_contrato",
            "codigo_contrato",
            "estado_contrato",
            "tipo_operacion",
            "fecha_inicio",
            "fecha_fin",
            "monto",
            "cliente_nombre",
            "propiedad_codigo",
        ]

    def get_cliente_nombre(self, obj):
        return f"{obj.cliente.nombres} {obj.cliente.apellidos}".strip()
