# pylint: disable=C0114,C0115,C0116,C0301,C0103
from django.db import models
from gestion_usuarios.models import Usuario
from .cliente import Cliente

class ClienteOportunidad(models.Model):

    ETAPA_CHOICES = [
        ('prospecto',    'Prospecto'),
        ('interesado',   'Interesado'),
        ('negociacion',  'Negociación'),
        ('cerrado',      'Cerrado'),
        ('perdido',      'Perdido'),
    ]

    cliente              = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='oportunidades')
    agente               = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='oportunidades')
    nombre               = models.CharField(max_length=150)
    descripcion          = models.TextField(blank=True, null=True)
    etapa                = models.CharField(max_length=15, choices=ETAPA_CHOICES, default='prospecto')
    valor_estimado       = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True)
    probabilidad         = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    fecha_cierre_est     = models.DateField(blank=True, null=True)
    creado_en            = models.DateTimeField(auto_now_add=True)
    actualizado_en       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cliente_oportunidades'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.nombre} - {self.cliente}"
