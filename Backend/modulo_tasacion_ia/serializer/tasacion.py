from rest_framework import serializers
from ..models import TasacionIA

class TasacionIASerializer(serializers.ModelSerializer):
    class Meta:
        model = TasacionIA
        fields = [
            'id', 'mensaje_usuario', 'imagen_referencia', 
            'audio_descripcion', 'respuesta_ia', 
            'transcripcion_audio', 'precio_estimado', 'creado_en'
        ]
        read_only_fields = ['respuesta_ia', 'transcripcion_audio', 'precio_estimado', 'creado_en']