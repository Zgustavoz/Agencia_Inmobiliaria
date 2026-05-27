from rest_framework import serializers
from ..models.busqueda_semantica import BusquedaSemanticaIA
# Importa aquí el serializer de tus propiedades
# from ..serializer.propiedad import PropiedadSerializer 

class BusquedaSemanticaIASerializer(serializers.ModelSerializer):
    audio_busqueda = serializers.FileField(required=False, allow_null=True)
    class Meta:
        model = BusquedaSemanticaIA
        fields = [
            'id', 'mensaje_texto', 'audio_busqueda', 
            'filtros_extraidos_ia', 'creado_en'
        ]
        read_only_fields = ['filtros_extraidos_ia', 'creado_en']