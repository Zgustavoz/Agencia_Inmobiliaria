from django.db import models
from cloudinary.models import CloudinaryField

class BusquedaSemanticaIA(models.Model):
    usuario = models.ForeignKey(
        'gestion_usuarios.Usuario', 
        on_delete=models.CASCADE,
        null=True,
        related_name="busquedas_realizadas"
    )
    
    # Entradas del usuario
    mensaje_texto = models.TextField(blank=True, null=True)
    audio_busqueda = CloudinaryField(
        'video', 
        folder='busquedas/audios/', 
        resource_type='video',
        null=True, 
        blank=True
    )
    
    # Lo que entendió la IA (lo guardamos por si queremos ver qué falló en el futuro)
    filtros_extraidos_ia = models.JSONField(blank=True, null=True)
    
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'busquedas_semanticas_ia'
        ordering = ['-creado_en']

    def __str__(self):
        return f"Búsqueda IA - {self.usuario.email if self.usuario else 'Anónimo'} - {self.creado_en.strftime('%d/%m/%Y')}"