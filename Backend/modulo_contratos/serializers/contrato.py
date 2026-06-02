from rest_framework import serializers
from modulo_contratos.models import Contrato
from datetime import date
from dateutil.relativedelta import relativedelta
from modulo_contratos.models import PagoContrato
from modulo_contratos.utils.pagos import generar_pagos_contrato_alquiler

class ContratoSerializer(serializers.ModelSerializer):

    cliente_nombre_completo = serializers.SerializerMethodField()
    propiedad_nombre = serializers.SerializerMethodField()
    operacion = serializers.ReadOnlyField(source='propiedad.modalidad_operacion')
    agente_nombre_completo = serializers.SerializerMethodField()
    estado_real = serializers.ReadOnlyField(source='estado_calculado')

    class Meta:
        model = Contrato
        fields = '__all__'
        read_only_fields = ('creado_en', 'actualizado_en')

    def validate_cliente(self, value):
        if not value.estado:
            raise serializers.ValidationError(
                'El cliente está inactivo.'
            )

        if not value.roles.filter(nombre__iexact='Cliente').exists():
            raise serializers.ValidationError(
                'El usuario seleccionado no tiene rol Cliente.'
            )

        return value

    def validate_agente(self, value):
        if not value.estado:
            raise serializers.ValidationError(
                'El agente está inactivo.'
            )

        if not value.roles.filter(nombre__iexact='Agente').exists():
            raise serializers.ValidationError(
                'El usuario seleccionado no tiene rol Agente.'
            )

        return value

    def validate(self, attrs):
        fecha_inicio = attrs.get('fecha_inicio')
        fecha_fin = attrs.get('fecha_fin')

        if fecha_fin and fecha_inicio and fecha_fin < fecha_inicio:
            raise serializers.ValidationError(
                'La fecha fin no puede ser menor que la fecha inicio.'
            )

        return attrs

    def get_cliente_nombre_completo(self, obj):
        return f"{obj.cliente.nombres} {obj.cliente.apellidos}"
    
    def get_agente_nombre_completo(self, obj):
        return f"{obj.agente.nombres} {obj.agente.apellidos}"
    
    def get_propiedad_nombre(self, obj):
        return f"{obj.propiedad.codigo_propiedad} - {obj.propiedad.titulo}"
    
    def create(self, validated_data):
        contrato = super().create(validated_data)

        generar_pagos_contrato_alquiler(contrato)

        return contrato