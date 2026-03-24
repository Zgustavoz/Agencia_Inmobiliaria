# pylint: disable=C0114,C0115,C0116
from django.db import models

class Rol(models.Model):
    nombre      = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    estado      = models.BooleanField(default=True)
    creado_en   = models.DateTimeField(auto_now_add=True)
    permisos    = models.ManyToManyField(
        'Permiso',
        through='RolPermiso',
        related_name='roles',
        blank=True
    )

    class Meta:
        db_table = 'roles'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class RolPermiso(models.Model):
    rol     = models.ForeignKey(Rol,       on_delete=models.CASCADE, db_column='id_rol')
    permiso = models.ForeignKey('Permiso', on_delete=models.CASCADE, db_column='id_permiso')

    class Meta:
        db_table        = 'rol_permiso'
        unique_together = ('rol', 'permiso')