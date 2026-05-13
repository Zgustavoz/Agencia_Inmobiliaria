# Backend\modulo_inmuebles\models\propiedad.py
from django.db import models
from django.conf import settings
from .zona import Zona
from modulo_administracion_configuracion.models import Moneda, Tenant

class Propiedad(models.Model):
    id_propiedad = models.BigAutoField(primary_key=True)
    codigo_propiedad = models.CharField(max_length=30, unique=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    tipo_inmueble = models.CharField(max_length=255, blank=True, null=True)
    
    # Modalidad (Sin FK según tu SQL, manejado como campos simples)
    id_modalidad = models.BigIntegerField() 
    modalidad_operacion = models.CharField(max_length=50, blank=True, null=True) # "Venta", "Alquiler"
    
    # Relaciones con FK confirmadas
    zona = models.ForeignKey(Zona, on_delete=models.PROTECT, db_column='id_zona')
    moneda = models.ForeignKey(Moneda, on_delete=models.PROTECT, db_column='id_moneda')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='propiedades', null=True, blank=True)
    
    # Precios
    precio = models.DecimalField(max_digits=14, decimal_places=2)
    expensas = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    comision_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Medidas
    superficie_total_m2 = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    superficie_construida_m2 = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    # Ubicación Geográfica
    latitud = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)
    longitud = models.DecimalField(max_digits=18, decimal_places=15, null=True, blank=True)

    # Detalles
    ambientes = models.IntegerField(default=0)
    dormitorios = models.IntegerField(default=0)
    banos = models.IntegerField(default=0, db_column='banos')
    garajes = models.IntegerField(default=0)
    antiguedad_anios = models.IntegerField(null=True, blank=True)
    pisos = models.IntegerField(null=True, blank=True)
    amoblado = models.BooleanField(default=False)
    servicios_basicos = models.TextField(blank=True, null=True)
    caracteristicas_adicionales = models.TextField(blank=True, null=True)
    
    # Flags de publicación
    estado_propiedad = models.CharField(max_length=255, blank=True, null=True, default='Disponible')
    publicado_web = models.BooleanField(default=True)
    publicado_movil = models.BooleanField(default=True)
    destacada = models.BooleanField(default=False)
    promocionada = models.BooleanField(default=False)
    fecha_publicacion = models.DateTimeField(null=True, blank=True)
    fecha_expiracion = models.DateTimeField(null=True, blank=True)
    
    # Auditoría
    id_agente_publicador = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        db_column='id_agente_publicador',
        related_name='propiedades_asignadas'
    )
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        db_column='creado_por',
        related_name='propiedades_creadas'
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'propiedades'