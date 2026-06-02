from django.db import models
from django.conf import settings

class FCMDevice(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dispositivos_fcm'
    )
    fcm_token = models.TextField(unique=True)
    dispositivo_id = models.CharField(max_length=255, blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'usuarios_fcm_dispositivos'
        verbose_name = 'Dispositivo FCM'
        verbose_name_plural = 'Dispositivos FCM'

    def __str__(self):
        return f"{self.usuario.username} - {self.fcm_token[:20]}..."
