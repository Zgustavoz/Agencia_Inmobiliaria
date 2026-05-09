from rest_framework import serializers
from modulo_contratos.models import DocumentoContrato


class DocumentoContratoSerializer(serializers.ModelSerializer):

    class Meta:
        model = DocumentoContrato
        fields = '__all__'