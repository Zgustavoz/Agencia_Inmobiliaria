from django.db import models
from modulo_inmuebles.models.propiedad import Propiedad
from gestion_usuarios.models.usuario import Usuario
from django.utils.timezone import now


class Contrato(models.Model):

    ESTADOS = [
        ('BORRADOR', 'Borrador'),
        ('ACTIVO', 'Activo'),
        ('VENCIDO', 'Vencido'),
        ('RENOVADO', 'Renovado'),
        ('FINALIZADO', 'Finalizado'),
        ('ANULADO', 'Anulado'),
    ]

    TIPOS_OPERACION = [
        ('COMPRA', 'Compra'),
        ('VENTA', 'Venta'),
        ('ALQUILER', 'Alquiler'),
        ('ANTICRETICO', 'Anticrético'),
    ]

    id_contrato = models.BigAutoField(primary_key=True)

    codigo_contrato = models.CharField(
        max_length=30,
        unique=True
    )

    propiedad = models.ForeignKey(
        Propiedad,
        on_delete=models.PROTECT,
        db_column='id_propiedad',
        related_name='contratos'
    )

    cliente = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column='id_cliente',
        related_name='contratos_cliente'
    )

    agente = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column='id_agente',
        related_name='contratos_agente'
    )

    tipo_operacion = models.CharField(
        max_length=20,
        choices=TIPOS_OPERACION
    )

    estado_contrato = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='BORRADOR'
    )

    monto = models.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)

    garantia = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True
    )

    comision = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0
    )

    condiciones = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    renovacion_de = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contratos'

    def __str__(self):
        return self.codigo_contrato
    
    @property
    def estado_calculado(self):
        from django.utils.timezone import now

        if self.fecha_fin and self.fecha_fin < now().date():
            return 'VENCIDO'

        return self.estado_contrato