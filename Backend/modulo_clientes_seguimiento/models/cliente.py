from django.db import models
from django.conf import settings

class Cliente(models.Model):
    id_cliente = models.BigAutoField(primary_key=True)
    codigo_cliente = models.CharField(max_length=30, unique=True, null=True, blank=True)
    tipo_documento = models.CharField(max_length=30, null=True, blank=True)
    nro_documento = models.CharField(max_length=50, null=True, blank=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    email = models.EmailField(max_length=150, null=True, blank=True)
    telefono = models.CharField(max_length=30, null=True, blank=True)
    whatsapp = models.CharField(max_length=30, null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    ocupacion = models.CharField(max_length=100, null=True, blank=True)
    origen = models.CharField(max_length=50, null=True, blank=True) # E.g., "Web", "Referido", "Facebook"
    observaciones = models.TextField(null=True, blank=True)
    estado_cliente = models.CharField(max_length=50, null=True, blank=True) # E.g., "Potencial", "Activo", "Inactivo"
    
    # Auditoría
    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        db_column='creado_por',
        related_name='clientes_registrados'
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clientes'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
