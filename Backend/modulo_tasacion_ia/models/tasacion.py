from django.db import models
from cloudinary.models import CloudinaryField
# Importamos el modelo Cliente desde tu otro módulo
from modulo_clientes_seguimiento.models.cliente import Cliente 
from django.conf import settings

class TasacionIA(models.Model):
    # Relacionamos con Cliente. Así cada cliente tiene su propio historial
    # y evitamos que se crucen datos entre ellos.
    # cliente = models.ForeignKey(
    #     Cliente, 
    #     on_delete=models.CASCADE, 
    #     related_name="tasaciones_ia"
    # )
    usuario = models.ForeignKey(
        'gestion_usuarios.Usuario', 
        on_delete=models.CASCADE,
        null=True,
        related_name="tasaciones_realizadas"
    )
    cliente = models.ForeignKey(
        Cliente, 
        on_delete=models.SET_NULL, # Cambiamos CASCADE por SET_NULL para no borrar la tasación si se borra el cliente
        related_name="tasaciones_ia",
        null=True, 
        blank=True
    )
    
    # El mensaje de texto que el usuario puede escribir opcionalmente
    mensaje_usuario = models.TextField(blank=True, null=True)
    
    # Multimedia (Cloudinary)
    imagen_referencia = CloudinaryField('image', folder='tasaciones/fotos/', null=True, blank=True)
    audio_descripcion = CloudinaryField('video', folder='tasaciones/audios/', null=True, blank=True)
    
    # Respuesta de la IA
    respuesta_ia = models.TextField(blank=True, null=True)
    transcripcion_audio = models.TextField(blank=True, null=True)
    precio_estimado = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tasaciones_ia'
        ordering = ['-creado_en'] # Lo más nuevo primero (estilo chat)

    def __str__(self):
        return f"Chat IA - {self.cliente.nombres} - {self.creado_en.strftime('%d/%m/%Y')}"