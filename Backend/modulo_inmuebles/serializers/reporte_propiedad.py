from rest_framework import serializers
from ..models.propiedad import Propiedad


class ReportePropiedadSerializer(serializers.ModelSerializer):
    zona_nombre = serializers.ReadOnlyField(source="zona.zona")
    zona_ciudad = serializers.ReadOnlyField(source="zona.ciudad")

    class Meta:
        model = Propiedad
        fields = [
            "id_propiedad",
            "codigo_propiedad",
            "titulo",
            "estado_propiedad",
            "precio",
            "zona_nombre",
            "zona_ciudad",
            "creado_en",
        ]
