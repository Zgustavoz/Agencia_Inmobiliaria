# pylint: disable=C0114,C0115,C0116,C0103
from django.db import models
from gestion_usuarios.models import Usuario
from .cliente import Cliente

class ClienteAgente(models.Model):
    cliente          = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='agentes')
    agente           = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='clientes_asignados')
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    activo           = models.BooleanField(default=True)

    class Meta:
        db_table        = 'cliente_agente'
        unique_together = ('cliente', 'agente')

    def __str__(self):
        return f"{self.cliente} → {self.agente}"
