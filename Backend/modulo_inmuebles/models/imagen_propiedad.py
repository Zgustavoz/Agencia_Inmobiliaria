from django.db import models
from .propiedad import Propiedad

class PropiedadImagen(models.Model):
    id_imagen      = models.BigAutoField(primary_key=True)
    propiedad      = models.ForeignKey(Propiedad, on_delete=models.CASCADE, related_name='imagenes', db_column='id_propiedad')
    url_imagen     = models.TextField() # Aquí guardarás la URL de Cloudinary
    nombre_archivo = models.CharField(max_length=255, blank=True, null=True)
    principal      = models.BooleanField(default=False)
    orden_visual   = models.IntegerField(default=1)
    subido_en      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'propiedad_imagenes'
        ordering = ['orden_visual']