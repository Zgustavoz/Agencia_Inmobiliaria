# gestion_usuarios/serializers/actividad_sistema_serializer.py
# hecho por jose para la bitacora
from rest_framework import serializers
from ..models.actividad_sistema import ActividadSistema

class ActividadSistemaSerializer(serializers.ModelSerializer):
    # Esto es para que en lugar de solo el ID, veamos el nombre del usuario
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = ActividadSistema
        fields = [
            'id_actividad', 'usuario', 'usuario_nombre', 'modulo', 
            'entidad', 'id_entidad', 'accion', 'detalle', 
            'ip_origen', 'user_agent', 'fecha_evento'
        ]