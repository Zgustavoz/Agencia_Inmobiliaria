from django.db import models
from .agencia import Agencia # Asumiendo que ya tienes tu modelo Agencia

class Plan(models.Model):
    nombre = models.CharField(max_length=50, unique=True) # Ej: 'Básico', 'Pro', 'Enterprise'
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    limite_propiedades = models.IntegerField(default=10)
    limite_agentes = models.IntegerField(default=3)
    permite_ia = models.BooleanField(default=False) # Para tu chatbot de fotos/audio
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Suscripcion(models.Model):
    ESTADOS = (
        ('activa', 'Activa'),
        ('vencida', 'Vencida'),
        ('cancelada', 'Cancelada'),
    )
    
    agencia = models.ForeignKey(Agencia, on_delete=models.CASCADE, related_name='suscripciones')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activa')
    id_transaccion_pago = models.CharField(max_length=100, blank=True, null=True) # Para Stripe/PayPal

    def __str__(self):
        return f"{self.agencia.nombre} - {self.plan.nombre}"