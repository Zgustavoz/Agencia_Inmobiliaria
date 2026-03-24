from django.db import models


class Moneda(models.Model):
    id_moneda = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=10)
    nombre = models.CharField(max_length=50)
    simbolo = models.CharField(max_length=10)
    estado = models.BooleanField()

    class Meta:
        db_table = 'monedas'
        verbose_name = 'Moneda'
        verbose_name_plural = 'Monedas'

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"