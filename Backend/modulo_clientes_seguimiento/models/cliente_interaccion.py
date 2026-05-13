# pylint: disable=C0114,C0115,C0116,C0301,C0103
from django.db import models
from gestion_usuarios.models import Usuario
from .cliente import Cliente

class ClienteInteraccion(models.Model):

    TIPO_CHOICES = [
        ('consulta',  'Consulta'),
        ('visita',    'Visita'),
        ('llamada',   'Llamada'),
        ('mensaje',   'Mensaje'),
        ('email',     'Email'),
        ('whatsapp',  'WhatsApp'),
    ]

    cliente              = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='interacciones')
    agente               = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='interacciones')
    tipo                 = models.CharField(max_length=20, choices=TIPO_CHOICES)
    asunto               = models.CharField(max_length=150, blank=True, null=True)
    detalle              = models.TextField(blank=True, null=True)
    proxima_accion       = models.CharField(max_length=150, blank=True, null=True)
    fecha_proxima_accion = models.DateTimeField(blank=True, null=True)
    creado_en            = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cliente_interacciones'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.tipo} - {self.cliente}"
