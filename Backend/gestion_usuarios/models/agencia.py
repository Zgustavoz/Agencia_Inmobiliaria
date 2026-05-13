from django.db import models

class Agencia(models.Model):
    nombre = models.CharField(max_length=100)
    # El slug es vital para identificar la agencia en la URL (ej: mi-inmobiliaria.com/agencia-bolivia)
    slug = models.SlugField(unique=True, max_length=100)
    nit = models.CharField(max_length=20, blank=True, null=True)
    logo_url = models.TextField(blank=True, null=True)
    
    # --- Campos extra para robustez SaaS ---
    email_contacto = models.EmailField(max_length=150, blank=True, null=True)
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    
    # Útil para que cada agencia personalice su interfaz (colores, redes sociales, etc.)
    configuracion = models.JSONField(default=dict, blank=True) 
    
    estado = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'agencias'
        verbose_name = 'Agencia'
        verbose_name_plural = 'Agencias'

    def __str__(self):
        return self.nombre

    # Propiedad útil para obtener la suscripción activa rápidamente
    @property
    def suscripcion_activa(self):
        # Importación local para evitar circularidad si los modelos están en archivos distintos
        from .modelos_saas import Suscripcion 
        return self.suscripciones.filter(estado='activa').first()
