# pylint: disable=C0114,C0115,C0116
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.estado:
            raise serializers.ValidationError('Tu cuenta está desactivada')

        return data

    @classmethod
    def get_token(cls, user):
        token              = super().get_token(user)
        token['username']  = user.username
        token['email']     = user.email
        token['es_admin']  = user.es_admin
        return token