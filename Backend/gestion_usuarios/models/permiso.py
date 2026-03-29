# pylint: disable=C0114,C0115,C0116
from django.db import models

class Permiso(models.Model):
    codigo      = models.CharField(max_length=100, unique=True)
    nombre      = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    estado      = models.BooleanField(default=True)

    class Meta:
        db_table = 'permisos'
        ordering = ['nombre']

    def __str__(self):
        return str(self.nombre)
