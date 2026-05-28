from django.db import models
from modulo_inmuebles.models.propiedad import Propiedad
from gestion_usuarios.models.usuario import Usuario
from modulo_administracion_configuracion.models import Moneda


class OperacionInmobiliaria(models.Model):
    ESTADOS = [
        ('abierta', 'Abierta'),
        ('cerrada', 'Cerrada'),
        ('anulada', 'Anulada'),
    ]

    TIPOS = [
        ('COMPRA', 'Compra'),
        ('VENTA', 'Venta'),
        ('ALQUILER', 'Alquiler'),
        ('ANTICRETICO', 'Anticrético'),
    ]

    id_operacion = models.BigAutoField(primary_key=True)
    codigo_operacion = models.CharField(max_length=30, unique=True)
    tipo_operacion = models.CharField(max_length=30, choices=TIPOS)

    propiedad = models.ForeignKey(
        Propiedad,
        on_delete=models.PROTECT,
        db_column='id_propiedad',
        related_name='operaciones'
    )
    cliente = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column='id_cliente',
        related_name='operaciones_cliente'
    )
    agente = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_agente',
        related_name='operaciones_agente'
    )

    id_cotizacion = models.BigIntegerField(
        null=True,
        blank=True,
        db_column='id_cotizacion'
    )

    monto_operacion = models.DecimalField(max_digits=14, decimal_places=2)
    moneda = models.ForeignKey(
        Moneda,
        on_delete=models.PROTECT,
        db_column='id_moneda',
        related_name='operaciones'
    )
    comision_monto = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    fecha_operacion = models.DateField()
    estado = models.CharField(max_length=30, choices=ESTADOS, default='cerrada')
    observaciones = models.TextField(blank=True, null=True)

    creado_en = models.DateTimeField(auto_now_add=True, db_column='creada_en')

    class Meta:
        db_table = 'operaciones_inmobiliarias'

    def __str__(self):
        return self.codigo_operacion
