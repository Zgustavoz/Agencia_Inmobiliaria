# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol
from modulo_clientes_seguimiento.models import Cliente

class RegistroSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model  = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password', 'password2',
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user     = Usuario.objects.create_user(password=password, **validated_data)

        # Asignar rol Cliente por defecto
        try:
            rol_cliente = Rol.objects.get(nombre='Cliente')
            user.roles.set([rol_cliente])
        except Rol.DoesNotExist:
            pass

        return user


class RegistroAgenteSerializer(serializers.ModelSerializer):
    password_hash = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    role = serializers.ChoiceField(
        choices=['agent', 'admin'],
        default='agent',
        required=False
    )
    foto_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password_hash', 'foto_url', 'role',
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'agent')
        password = validated_data.pop('password_hash')
        user = Usuario.objects.create_user(password=password, **validated_data)

        role_name = 'Administrador' if role == 'admin' else 'Agente'
        try:
            rol = Rol.objects.get(nombre=role_name)
            user.roles.set([rol])
            if role == 'admin':
                user.es_admin = True
                user.save(update_fields=['es_admin'])
        except Rol.DoesNotExist:
            pass

        return user

class RegistroClienteSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    # Campos adicionales para la tabla Cliente
    ci               = serializers.CharField(required=False, allow_blank=True)
    direccion        = serializers.CharField(required=False, allow_blank=True)
    ocupacion        = serializers.CharField(required=False, allow_blank=True)
    fecha_nacimiento = serializers.DateField(required=False, allow_null=True)
    telefono         = serializers.CharField(required=False, allow_blank=True)
    whatsapp         = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model  = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password', 'password2',
            'ci', 'direccion', 'ocupacion', 'fecha_nacimiento', 'whatsapp'
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return attrs

    def create(self, validated_data):
        # Extraer datos específicos para la tabla Cliente
        ci = validated_data.pop('ci', None)
        direccion = validated_data.pop('direccion', None)
        ocupacion = validated_data.pop('ocupacion', None)
        fecha_nacimiento = validated_data.pop('fecha_nacimiento', None)
        whatsapp = validated_data.pop('whatsapp', None)
        
        # Quitamos password2 porque create_user no lo usa
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        # 1. Crear el Usuario (para el login)
        user = Usuario.objects.create_user(password=password, **validated_data)
        
        # Asignar rol Cliente por defecto
        try:
            rol_cliente = Rol.objects.get(nombre='Cliente')
            user.roles.set([rol_cliente])
        except Rol.DoesNotExist:
            pass

        # 2. Crear la ficha en la tabla Cliente (para el CRM) y vincularlo
        Cliente.objects.create(
            usuario=user,
            nombres=user.nombres,
            apellidos=user.apellidos,
            email=user.email,
            telefono=user.telefono,
            whatsapp=whatsapp,
            nro_documento=ci,
            tipo_documento='CI',
            direccion=direccion,
            ocupacion=ocupacion,
            fecha_nacimiento=fecha_nacimiento,
            origen='movil',
            estado='nuevo'
        )

        return user
class RegistroTrabajadorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    # Permite al administrador elegir el rol del trabajador al crearlo
    rol_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'nombres', 'apellidos',
            'telefono', 'password', 'rol_id'
        ]

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        rol_id = validated_data.pop('rol_id')
        password = validated_data.pop('password')

        # 1. Obtener la agencia del administrador que está creando al trabajador
        agencia = request.user.agencia

        # 2. Validar Límite del Plan SaaS
        from ..models import Suscripcion # Asegúrate de importar el modelo
        suscripcion_activa = Suscripcion.objects.filter(agencia=agencia, estado='activa').first()
        conteo_usuarios = Usuario.objects.filter(agencia=agencia).count()
        
        if suscripcion_activa and conteo_usuarios >= suscripcion_activa.plan.limite_agentes:
            raise serializers.ValidationError(
                f"No puedes agregar más trabajadores. Tu plan permite un máximo de {suscripcion_activa.plan.limite_agentes}."
            )

        # 3. Crear el trabajador
        validated_data['agencia'] = agencia
        validated_data['estado'] = True # Entra activo directo porque lo creó el admin
        
        user = Usuario.objects.create_user(password=password, **validated_data)

        # 4. Asignar el rol seleccionado (verificando que el rol pertenezca a la agencia)
        try:
            rol = Rol.objects.get(id=rol_id, agencia=agencia)
            user.roles.set([rol])
        except Rol.DoesNotExist:
            raise serializers.ValidationError("El rol seleccionado no es válido o no pertenece a tu agencia.")

        return user
class RegistroAgenciaSerializer(serializers.ModelSerializer):
    # Datos del dueño
    email = serializers.EmailField(write_only=True, required=True)
    nombres = serializers.CharField(write_only=True, required=True)
    apellidos = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    # Datos de la suscripción
    plan_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        from ..models import Agencia
        model = Agencia
        fields = ['nombre', 'email', 'nombres', 'apellidos', 'password', 'plan_id']

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Este correo ya está registrado.')
        return value

    def create(self, validated_data):
        from ..models import Agencia, Plan, Suscripcion
        import timezone
        from datetime import timedelta

        # Extraemos los datos
        email = validated_data.pop('email')
        nombres = validated_data.pop('nombres')
        apellidos = validated_data.pop('apellidos')
        password = validated_data.pop('password')
        plan_id = validated_data.pop('plan_id')

        # 1. Crear la Agencia
        agencia = Agencia.objects.create(nombre=validated_data['nombre'], estado=True)

        # 2. Crear al Dueño (Administrador principal)
        # Usamos el email como username temporal o generamos uno
        username_generado = email.split('@')[0]
        
        dueño = Usuario.objects.create_user(
            username=username_generado,
            email=email,
            nombres=nombres,
            apellidos=apellidos,
            password=password,
            agencia=agencia,
            es_admin=True,
            estado=True
        )

        # 3. Asignar el Plan (Suscripción)
        try:
            plan_elegido = Plan.objects.get(id=plan_id)
            # Ejemplo: Le damos 30 días o lo que diga el plan
            fecha_fin = timezone.now() + timedelta(days=30) 
            Suscripcion.objects.create(
                agencia=agencia,
                plan=plan_elegido,
                fecha_inicio=timezone.now(),
                fecha_fin=fecha_fin,
                estado='activa'
            )
        except Plan.DoesNotExist:
            raise serializers.ValidationError("El plan seleccionado no existe.")

        return agencia # O puedes retornar un diccionario con tokens si quieres loguearlo de inmediat
