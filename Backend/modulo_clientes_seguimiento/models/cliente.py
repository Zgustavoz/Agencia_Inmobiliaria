# pylint: disable=C0114,C0115,C0116,C0301,C0103
from django.db import models
from gestion_usuarios.models import Usuario
class Cliente(models.Model):

    ESTADO_CHOICES = [
        ('nuevo',       'Nuevo'),
        ('seguimiento', 'En seguimiento'),
        ('activo',      'Activo'),
        ('inactivo',    'Inactivo'),
        ('cerrado',     'Cerrado'),
    ]

    ORIGEN_CHOICES = [
        ('web',      'Web'),
        ('movil',    'Móvil'),
        ('referido', 'Referido'),
        ('agente',   'Agente'),
        ('campana',  'Campaña'),
    ]

    codigo_cliente   = models.CharField(max_length=30, unique=True, blank=True, null=True)
    tipo_documento   = models.CharField(max_length=20, blank=True, null=True)
    nro_documento    = models.CharField(max_length=50, blank=True, null=True)
    nombres          = models.CharField(max_length=100)
    apellidos        = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    email            = models.EmailField(max_length=150, blank=True, null=True)
    telefono         = models.CharField(max_length=30, blank=True, null=True)
    whatsapp         = models.CharField(max_length=30, blank=True, null=True)
    direccion        = models.CharField(max_length=255, blank=True, null=True)
    ocupacion        = models.CharField(max_length=100, blank=True, null=True)
    origen           = models.CharField(max_length=30, choices=ORIGEN_CHOICES, blank=True, null=True)
    estado           = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='nuevo')
    observaciones    = models.TextField(blank=True, null=True)
    
    # NUEVO: Relación con la cuenta de acceso (Login)
    usuario          = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='perfil_cliente'
    )
    
    # ✓ Multi-tenant: cada cliente pertenece a un tenant
    tenant = models.ForeignKey(
        'modulo_administracion_configuracion.Tenant',
        on_delete=models.CASCADE,
        related_name='clientes'
    )
    
    creado_por       = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='clientes_creados')
    creado_en        = models.DateTimeField(auto_now_add=True)
    actualizado_en   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clientes'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

    def save(self, *args, **kwargs):
        if not self.codigo_cliente:
            super().save(*args, **kwargs)
            self.codigo_cliente = f"CLI-{self.pk:05d}"
            Cliente.objects.filter(pk=self.pk).update(codigo_cliente=self.codigo_cliente)
        else:
            super().save(*args, **kwargs)
