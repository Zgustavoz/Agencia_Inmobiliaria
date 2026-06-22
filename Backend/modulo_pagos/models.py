from django.db import models
from modulo_administracion_configuracion.models import Tenant
from modulo_contratos.models import PagoContrato

class Pago(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='pagos')
    pago_contrato = models.ForeignKey(PagoContrato, on_delete=models.SET_NULL, null=True, blank=True, related_name='pagos_stripe')
    stripe_checkout_id = models.CharField(max_length=255, unique=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    moneda = models.CharField(max_length=10, default='usd')
    estado = models.CharField(max_length=20, default='pendiente') # pendiente, completado, fallido
    plan_adquirido = models.CharField(max_length=50)
    fecha_pago = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago {self.stripe_checkout_id} - {self.tenant.nombre}"
