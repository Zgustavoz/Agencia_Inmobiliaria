# pylint: disable=C0114,C0115,C0116
from rest_framework import serializers
from ..models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    plan_display = serializers.CharField(source='get_plan_display', read_only=True)
    vencido = serializers.SerializerMethodField()
    puede_crear_propiedad = serializers.SerializerMethodField()
    
    class Meta:
        model = Tenant
        fields = [
            'id',
            'nombre',
            'descripcion',
            'estado',
            'fecha_vencimiento_pago',
            'plan',
            'plan_display',
            'max_propiedades',
            'vencido',
            'puede_crear_propiedad',
            'creado_en',
            'actualizado_en',
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en']
    
    def get_vencido(self, obj):
        return obj.esta_vencido()
    
    def get_puede_crear_propiedad(self, obj):
        return obj.puede_crear_propiedad()
