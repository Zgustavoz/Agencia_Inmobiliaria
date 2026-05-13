# pylint: disable=C0114,C0115,C0116,E1101
from django.db import models
from django.utils import timezone


class PlanSuscripcion(models.TextChoices):
    """Planes de suscripción disponibles."""
    BASICO = 'basico', 'Básico'
    PROFESIONAL = 'profesional', 'Profesional'
    EMPRESA = 'empresa', 'Empresa'


class Tenant(models.Model):
    """
    Modelo para gestionar multi-tenancy con esquema compartido.
    Cada empresa o cliente (inquilino) tiene su propio registro de Tenant,
    que controla su suscripción, plan, estado y límites de recursos.
    """
    nombre = models.CharField(max_length=255, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    # Estado de suscripción
    estado = models.BooleanField(default=True, help_text="¿El tenant está activo?")
    fecha_vencimiento_pago = models.DateField(
        default=timezone.now,
        help_text="Fecha en la que vence el período de pago actual"
    )
    
    # Plan y límites
    plan = models.CharField(
        max_length=20,
        choices=PlanSuscripcion.choices,
        default=PlanSuscripcion.BASICO
    )
    max_propiedades = models.IntegerField(
        default=3,
        help_text="Máximo número de propiedades permitidas en este plan"
    )
    
    # Auditoría
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenants'
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'
        indexes = [
            models.Index(fields=['estado']),
            models.Index(fields=['plan']),
        ]
    
    def __str__(self):
        return f"{self.nombre} ({self.get_plan_display()})"
    
    def esta_vencido(self):
        """Retorna True si la suscripción ha vencido."""
        return self.fecha_vencimiento_pago < timezone.now().date()
    
    def puede_crear_propiedad(self):
        """Verifica si el tenant puede crear una nueva propiedad según su plan."""
        if not self.estado or self.esta_vencido():
            return False
        
        # Importa aquí para evitar circular imports
        from modulo_inmuebles.models import Propiedad
        count = Propiedad.objects.filter(tenant=self).count()
        return count < self.max_propiedades
    
    def obtener_rutas_bloqueadas_por_plan(self):
        """
        Retorna una lista de rutas/acciones que están bloqueadas para este plan.
        Útil para validaciones en vistas.
        """
        rutas_bloqueadas = []
        if self.plan == PlanSuscripcion.BASICO:
            rutas_bloqueadas.extend([
                'reportes-avanzados',
                'analytics-premium',
            ])
        return rutas_bloqueadas
