from django.db import models
from django.conf import settings


class Notificacion(models.Model):
    TIPOS = [
        ('propiedad', 'Nueva Propiedad'),
        ('contrato', 'Contrato'),
        ('pago', 'Pago'),
        ('sistema', 'Sistema'),
    ]
    destinatario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notificaciones',
    )
    titulo = models.CharField(max_length=200)
    cuerpo = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS, default='sistema')
    leida = models.BooleanField(default=False)
    creada_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creada_en']


class DispositivoFCM(models.Model):
    PLATAFORMAS = [('android', 'Android'), ('ios', 'iOS'), ('web', 'Web')]
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dispositivos_fcm',
    )
    token = models.TextField(unique=True)
    plataforma = models.CharField(max_length=10, choices=PLATAFORMAS, default='android')
    activo = models.BooleanField(default=True)
    actualizado_en = models.DateTimeField(auto_now=True)
