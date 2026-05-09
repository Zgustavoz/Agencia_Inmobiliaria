from django.db import models
from .contrato import Contrato


class PagoContrato(models.Model):

    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
        ('VENCIDO', 'Vencido'),
    ]

    id_pago = models.BigAutoField(primary_key=True)

    contrato = models.ForeignKey(
        Contrato,
        on_delete=models.CASCADE,
        related_name='pagos'
    )

    monto = models.DecimalField(max_digits=14, decimal_places=2)

    fecha_vencimiento = models.DateField()
    fecha_pago = models.DateField(null=True, blank=True)

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )

    observaciones = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'pagos_contrato'