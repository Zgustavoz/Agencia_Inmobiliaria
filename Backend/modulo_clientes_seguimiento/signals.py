from django.db.models.signals import post_save
from django.dispatch import receiver
from .models.visita import Visita
from .models.cliente_oportunidad import ClienteOportunidad
from shared.services.firebase_service import FirebaseService

@receiver(post_save, sender=ClienteOportunidad)
def enviar_notificacion_oportunidad(sender, instance, created, **kwargs):
    """Envía notificación al cliente cuando se crea una nueva oportunidad"""
    if created:  # Solo cuando se crea, no cuando se actualiza
        cliente_user = instance.cliente.usuario
        if cliente_user:
            print(f"DEBUG: Enviando notificación push de nueva oportunidad al usuario {cliente_user.username}")
            
            FirebaseService.send_push_notification(
                user=cliente_user,
                title=f"🎯 Nueva Oportunidad: {instance.nombre}",
                body=f"Se ha registrado una nueva oportunidad para ti. Etapa: {instance.get_etapa_display()}",
                data={
                    "tipo": "oportunidad_nueva",
                    "id_oportunidad": str(instance.id),
                    "nombre": instance.nombre,
                    "etapa": instance.etapa
                }
            )

@receiver(post_save, sender=Visita)
def enviar_notificacion_cambio_estado(sender, instance, created, **kwargs):
    # Si no es nuevo y el estado es 'confirmada'
    # Nota: Para ser más precisos, podríamos comparar con el estado anterior, 
    # pero post_save no tiene el estado previo fácilmente sin lógica extra.
    # Por simplicidad, si está en confirmada enviamos la notificación.
    if instance.estado == 'confirmada':
        cliente_user = instance.cliente.usuario
        if cliente_user:
            propiedad_titulo = instance.propiedad.titulo
            fecha = instance.fecha_visita.strftime('%d/%m/%Y')
            hora = instance.hora_inicio.strftime('%H:%M')
            
            print(f"DEBUG: Enviando notificación push para visita {instance.id_visita} al usuario {cliente_user.username}")
            
            FirebaseService.send_push_notification(
                user=cliente_user,
                title="¡Visita Confirmada! 🏠",
                body=f"Tu visita para '{propiedad_titulo}' ha sido aceptada para el {fecha} a las {hora}.",
                data={
                    "tipo": "visita_confirmada",
                    "id_visita": str(instance.id_visita),
                    "propiedad_id": str(instance.propiedad.id_propiedad)
                }
            )
