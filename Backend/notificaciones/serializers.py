from rest_framework import serializers
from .models import Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['id', 'titulo', 'cuerpo', 'tipo', 'leida', 'creada_en']
        read_only_fields = ['id', 'titulo', 'cuerpo', 'tipo', 'creada_en']
