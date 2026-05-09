from django.db import models

class BackupCloud(models.Model):
    nombre = models.CharField(max_length=255)
    url = models.URLField(max_length=500)
    key_r2 = models.CharField(max_length=255)
    tamano = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Respaldo en Nube"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.nombre