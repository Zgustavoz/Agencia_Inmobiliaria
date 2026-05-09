# pylint: disable=C0114,C0115,C0116,C0301,C0103
from rest_framework import serializers
from ..models import Cliente, ClienteAgente, ClienteInteraccion, ClienteOportunidad, ClienteRecordatorio

class ClienteInteraccionSerializer(serializers.ModelSerializer):
    agente_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = ClienteInteraccion
        fields = [
            'id', 'tipo', 'asunto', 'detalle',
            'proxima_accion', 'fecha_proxima_accion',
            'agente', 'agente_nombre', 'creado_en',
        ]
        read_only_fields = ['id', 'creado_en']

    def get_agente_nombre(self, obj):
        if obj.agente:
            return f"{obj.agente.nombres} {obj.agente.apellidos}"
        return None


class ClienteOportunidadSerializer(serializers.ModelSerializer):
    agente_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = ClienteOportunidad
        fields = [
            'id', 'nombre', 'descripcion', 'etapa',
            'valor_estimado', 'probabilidad', 'fecha_cierre_est',
            'agente', 'agente_nombre', 'creado_en', 'actualizado_en',
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en']

    def get_agente_nombre(self, obj):
        if obj.agente:
            return f"{obj.agente.nombres} {obj.agente.apellidos}"
        return None


class ClienteRecordatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ClienteRecordatorio
        fields = [
            'id', 'titulo', 'descripcion',
            'fecha_recordatorio', 'atendido', 'atendido_en',
            'usuario', 'creado_en',
        ]
        read_only_fields = ['id', 'creado_en', 'atendido_en']


class ClienteAgenteSerializer(serializers.ModelSerializer):
    agente_nombre = serializers.SerializerMethodField()

    class Meta:
        model  = ClienteAgente
        fields = ['id', 'agente', 'agente_nombre', 'fecha_asignacion', 'activo']
        read_only_fields = ['id', 'fecha_asignacion']

    def get_agente_nombre(self, obj):
        return f"{obj.agente.nombres} {obj.agente.apellidos}"


class ClienteSerializer(serializers.ModelSerializer):
    interacciones  = ClienteInteraccionSerializer(many=True, read_only=True)
    oportunidades  = ClienteOportunidadSerializer(many=True, read_only=True)
    recordatorios  = ClienteRecordatorioSerializer(many=True, read_only=True)
    agentes        = ClienteAgenteSerializer(many=True, read_only=True)
    creado_por_nombre = serializers.SerializerMethodField()
    total_interacciones = serializers.SerializerMethodField()
    total_oportunidades = serializers.SerializerMethodField()

    class Meta:
        model  = Cliente
        fields = [
            'id', 'codigo_cliente', 'tipo_documento', 'nro_documento',
            'nombres', 'apellidos', 'fecha_nacimiento',
            'email', 'telefono', 'whatsapp', 'direccion',
            'ocupacion', 'origen', 'estado', 'observaciones',
            'creado_por', 'creado_por_nombre', 'creado_en', 'actualizado_en',
            'interacciones', 'oportunidades', 'recordatorios', 'agentes',
            'total_interacciones', 'total_oportunidades',
        ]
        read_only_fields = ['id', 'codigo_cliente', 'creado_en', 'actualizado_en']

    def get_creado_por_nombre(self, obj):
        if obj.creado_por:
            return f"{obj.creado_por.nombres} {obj.creado_por.apellidos}"
        return None

    def get_total_interacciones(self, obj):
        return obj.interacciones.count()

    def get_total_oportunidades(self, obj):
        return obj.oportunidades.count()


class ClienteListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados"""
    total_interacciones = serializers.SerializerMethodField()
    total_oportunidades = serializers.SerializerMethodField()
    agente_principal    = serializers.SerializerMethodField()

    class Meta:
        model  = Cliente
        fields = [
            'id', 'codigo_cliente', 'nombres', 'apellidos',
            'email', 'telefono', 'whatsapp', 'estado', 'origen',
            'creado_en', 'total_interacciones', 'total_oportunidades',
            'agente_principal',
        ]

    def get_total_interacciones(self, obj):
        return obj.interacciones.count()

    def get_total_oportunidades(self, obj):
        return obj.oportunidades.count()

    def get_agente_principal(self, obj):
        agente = obj.agentes.filter(activo=True).first()
        if agente:
            return f"{agente.agente.nombres} {agente.agente.apellidos}"
        return None