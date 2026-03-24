# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol

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