from rest_framework import serializers


class EstadisticasSerializer(serializers.Serializer):
    propiedades = serializers.DictField()
    usuarios = serializers.DictField()
    contratos = serializers.DictField()
    finanzas = serializers.DictField()