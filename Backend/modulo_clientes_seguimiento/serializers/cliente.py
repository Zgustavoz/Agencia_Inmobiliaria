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
        read_only_fields = ['id', 'creado_en', 'atendido_en', 'usuario']


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
            'usuario', # Agregamos el campo usuario
        ]
        read_only_fields = ['id', 'codigo_cliente', 'creado_en', 'actualizado_en', 'usuario']

    def get_creado_por_nombre(self, obj):
        if obj.creado_por:
            return f"{obj.creado_por.nombres} {obj.creado_por.apellidos}"
        return None

    def get_total_interacciones(self, obj):
        return obj.interacciones.count()

    def get_total_oportunidades(self, obj):
        return obj.oportunidades.count()

    def create(self, validated_data):
        from gestion_usuarios.models import Usuario, Rol
        import random
        import string

        email = validated_data.get('email')
        tenant = validated_data.get('tenant')
        
        # Si tiene email, intentamos crearle una cuenta de usuario automáticamente
        if email:
            # Verificar si ya existe un usuario con ese email
            user = Usuario.objects.filter(email=email).first()
            
            if not user:
                # Generar un username basado en el email o nombres
                username = email.split('@')[0]
                if Usuario.objects.filter(username=username).exists():
                    username = f"{username}_{''.join(random.choices(string.digits, k=4))}"
                
                # Crear el usuario con una contraseña temporal (usamos una por defecto para que el admin pueda comunicarla)
                temp_pass = "Cliente123#"
                user = Usuario.objects.create_user(
                    username=username,
                    email=email,
                    password=temp_pass,
                    nombres=validated_data.get('nombres', ''),
                    apellidos=validated_data.get('apellidos', ''),
                    telefono=validated_data.get('telefono', ''),
                    tenant=tenant,
                    estado=True
                )
                
                # Asignar rol Cliente
                try:
                    rol_cliente = Rol.objects.get(nombre='Cliente')
                    user.roles.add(rol_cliente)
                except Rol.DoesNotExist:
                    pass
            
            validated_data['usuario'] = user

        # Asegurar tipo_documento por defecto si no viene
        if not validated_data.get('tipo_documento'):
            validated_data['tipo_documento'] = 'CI'

        return super().create(validated_data)


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
            'nro_documento', 
            'ocupacion',
            'direccion',
            'observaciones',
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