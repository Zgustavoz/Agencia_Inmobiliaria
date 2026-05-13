from django.db import models
from django.conf import settings
from modulo_inmuebles.models.propiedad import Propiedad
from .cliente import Cliente

class HorarioDisponibilidad(models.Model):
    id_horario = models.BigAutoField(primary_key=True)
    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE, related_name='horarios_visita', db_column='id_propiedad')
    dia_semana = models.IntegerField() # 0=Lunes, 6=Domingo
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'propiedad_horarios_visita'
        verbose_name = 'Horario de Disponibilidad'
        verbose_name_plural = 'Horarios de Disponibilidad'

class Visita(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('realizada', 'Realizada'),
        ('cancelada', 'Cancelada'),
    )

    id_visita = models.BigAutoField(primary_key=True)
    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE, db_column='id_propiedad', related_name='visitas')
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='visitas')
    agente = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        db_column='id_agente',
        related_name='visitas_atendidas'
    )
    
    fecha_visita = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    
    # Comentarios y Calificación
    comentario_cliente = models.TextField(blank=True, null=True)
    comentario_agente = models.TextField(blank=True, null=True)
    calificacion = models.IntegerField(blank=True, null=True) # 1 a 5
    
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'propiedad_visitas'
        verbose_name = 'Visita'
        verbose_name_plural = 'Visitas'

    def __str__(self):
        return f"Visita {self.id_visita} - {self.propiedad.titulo}"
