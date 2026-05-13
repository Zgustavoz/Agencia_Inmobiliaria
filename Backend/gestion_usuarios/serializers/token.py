# pylint: disable=C0114,C0115,C0116
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.estado:
            raise serializers.ValidationError('Tu cuenta está desactivada')

        # Añadimos datos de la agencia a la respuesta del login
        if self.user.agencia:
            data['agencia_nombre'] = self.user.agencia.nombre
            data['agencia_slug'] = self.user.agencia.slug
            data['agencia_id'] = self.user.agencia.id

        # ESTO ES LO QUE NECESITA TU FRONTEND EN loginRequest
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'nombres': self.user.nombres,
            'apellidos': self.user.apellidos,
            'es_admin': self.user.es_admin,
            'agencia_id': self.user.agencia.id if self.user.agencia else None,
            'agencia_slug': self.user.agencia.slug if self.user.agencia else None,
        }
        return data

    @classmethod
    def get_token(cls, user):
        token              = super().get_token(user)
        token['username']  = user.username
        token['email']     = user.email
        token['es_admin']  = user.es_admin
        token['agencia_id'] = user.agencia.id if user.agencia else None
        return token