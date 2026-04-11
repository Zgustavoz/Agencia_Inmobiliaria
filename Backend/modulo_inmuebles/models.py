from django.db import models
from django.conf import settings
from modulo_administracion_configuracion.models import Zona, Moneda, Modalidad # Ajusta según tus nombres reales

class Propiedad(models.Model):
    id_propiedad = models.BigAutoField(primary_key=True)
    codigo_propiedad = models.CharField(max_length=30, unique=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(null=True, blank=True)
    
    # Relaciones
    # Nota: Usa el AUTH_USER_MODEL para referirte a tus usuarios
    id_zona = models.ForeignKey(Zona, on_delete=models.PROTECT, related_name='propiedades')
    id_moneda = models.ForeignKey(Moneda, on_delete=models.PROTECT)
    id_agente_publicador = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='propiedades_asignadas'
    )
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='propiedades_creadas'
    )

    # Precios y Superficies
    precio = models.DecimalField(max_digits=14, decimal_places=2)
    expensas = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    superficie_total_m2 = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    # ... (añade el resto de campos como ambientes, dormitorios, etc.)

    # Auditoría
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'propiedades'
        verbose_name_plural = 'Propiedades'