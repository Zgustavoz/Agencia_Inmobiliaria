# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from ..models import Usuario, Rol

class RegistroSerializer(serializers.ModelSerializer):
    # Campos virtuales (no están en la BD)
    password2 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    roles_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'password2', 
            'nombres', 'apellidos', 'ci', 'telefono', 
            'direccion', 'ocupacion', 'fecha_nacimiento', 
            'roles_ids', 
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # --- UN SOLO VALIDATE ---
    def validate(self, data):
        pw1 = data.get('password')
        pw2 = data.get('password2')

        # Si el frontend manda password2, verificamos que coincidan
        if pw1 and pw2 and pw1 != pw2:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        return data

    # --- UN SOLO CREATE ---
    def create(self, validated_data):
        # Usamos pop seguro para campos que no van a la tabla Usuario
        validated_data.pop('password2', None) 
        roles_ids = validated_data.pop('roles_ids', [])
        
        # Extraemos la password para encriptarla
        password = validated_data.pop('password', None)
        
        # Creamos la instancia del usuario
        usuario = Usuario(**validated_data)
        
        if password:
            usuario.set_password(password)
        
        usuario.save()
        
        # Asignamos roles si vienen en el JSON
        if roles_ids:
            usuario.roles.set(roles_ids)
            
        return usuario

    # --- VALIDACIONES DE UNICIDAD ---
    def validate_email(self, value):
        if value and Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError('Ya existe una cuenta con este email')
        return value

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError('Este username ya está en uso')
        return value