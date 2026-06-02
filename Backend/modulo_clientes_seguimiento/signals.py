from django.db.models.signals import post_save
from django.dispatch import receiver
from .models.visita import Visita
from shared.services.firebase_service import FirebaseService

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
