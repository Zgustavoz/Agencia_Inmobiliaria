# gestion_usuarios/models/actividad_sistema.py   
#Jose creo esto por si esta mal Gustavo no me pegues
from django.db import models
from .usuario import Usuario

class ActividadSistema(models.Model):
    id_actividad = models.BigAutoField(primary_key=True)
    # Relación con el usuario que hizo la acción
    usuario      = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, db_column='id_usuario')
    
    modulo       = models.CharField(max_length=50)
    entidad      = models.CharField(max_length=50) # Ejemplo: 'Inmueble', 'Usuario'
    id_entidad   = models.BigIntegerField(null=True, blank=True)
    accion       = models.CharField(max_length=50) # Ejemplo: 'CREAR', 'LOGIN', 'ELIMINAR'
    detalle      = models.TextField()
    
    ip_origen    = models.CharField(max_length=50, blank=True, null=True)
    user_agent   = models.TextField(blank=True, null=True)
    fecha_evento = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'actividad_sistema'
        ordering = ['-fecha_evento'] # Lo más reciente primero

    def __str__(self):
        return f"{self.usuario} - {self.accion} - {self.modulo}"