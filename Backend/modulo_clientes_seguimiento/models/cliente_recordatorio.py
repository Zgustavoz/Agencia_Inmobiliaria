# pylint: disable=C0114,C0115,C0116,C0301,C0103
from django.db import models
from gestion_usuarios.models import Usuario
from .cliente import Cliente

class ClienteRecordatorio(models.Model):
    cliente            = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='recordatorios')
    usuario            = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='recordatorios')
    titulo             = models.CharField(max_length=150)
    descripcion        = models.TextField(blank=True, null=True)
    fecha_recordatorio = models.DateTimeField()
    atendido           = models.BooleanField(default=False)
    atendido_en        = models.DateTimeField(blank=True, null=True)
    creado_en          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cliente_recordatorios'
        ordering = ['fecha_recordatorio']

    def __str__(self):
        return f"{self.titulo} - {self.cliente}"
