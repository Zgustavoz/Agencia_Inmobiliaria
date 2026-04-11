from django.db import models

class Zona(models.Model):
    id_zona      = models.BigAutoField(primary_key=True)
    pais         = models.CharField(max_length=100, default='Bolivia')
    departamento = models.CharField(max_length=100, blank=True, null=True)
    provincia    = models.CharField(max_length=100, blank=True, null=True)
    municipio    = models.CharField(max_length=100, blank=True, null=True)
    ciudad       = models.CharField(max_length=100, blank=True, null=True)
    zona         = models.CharField(max_length=150)
    barrio       = models.CharField(max_length=150, blank=True, null=True)
    referencia   = models.CharField(max_length=255, blank=True, null=True)
    latitud      = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitud     = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    estado       = models.BooleanField(default=True)

    class Meta:
        db_table = 'zonas'

    def __str__(self):
        return f"{self.zona} ({self.ciudad})"