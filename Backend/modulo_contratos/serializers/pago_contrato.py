from rest_framework import serializers
from modulo_contratos.models import PagoContrato


class PagoContratoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PagoContrato
        fields = '__all__'