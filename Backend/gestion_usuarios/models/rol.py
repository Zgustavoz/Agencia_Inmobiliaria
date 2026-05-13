# pylint: disable=C0114,C0115,C0116
from django.db import models
from .agencia import Agencia

class Rol(models.Model):
    nombre      = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    estado      = models.BooleanField(default=True)
    creado_en   = models.DateTimeField(auto_now_add=True)
    permisos    = models.ManyToManyField(
        'Permiso',
        through='RolPermiso',
        related_name='roles',
        blank=True
    ) 
    agencia = models.ForeignKey(
        Agencia, 
        on_delete=models.CASCADE, 
        null=True, 
        db_column='id_agencia'
    )
    class Meta:
        db_table = 'roles'
        ordering = ['nombre']
        unique_together = ('nombre', 'agencia')

    def __str__(self):
        # Ayuda visual en el admin para saber de qué agencia es el rol
        if self.agencia:
            return f"{self.nombre} ({self.agencia.nombre})"
        return f"{self.nombre} (Global)"


class RolPermiso(models.Model):
    rol     = models.ForeignKey(Rol,       on_delete=models.CASCADE, db_column='id_rol')
    permiso = models.ForeignKey('Permiso', on_delete=models.CASCADE, db_column='id_permiso')

    class Meta:
        db_table        = 'rol_permiso'
        unique_together = ('rol', 'permiso')