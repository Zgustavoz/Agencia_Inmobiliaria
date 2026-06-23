from django.db.models.signals import post_save
from django.dispatch import receiver

from modulo_contratos.models import Contrato
from shared.services.firebase_service import FirebaseService


@receiver(post_save, sender=Contrato)
def enviar_notificacion_contrato_creado(sender, instance, created, **kwargs):
    """Envia una notificacion push al cliente cuando se crea un contrato."""
    if not created:
        return

    cliente_user = instance.cliente
    if not cliente_user:
        return

    propiedad_titulo = getattr(instance.propiedad, 'titulo', 'una propiedad')
    title = "Nuevo contrato disponible"
    body = (
        f"Se creo el contrato {instance.codigo_contrato} "
        f"para {propiedad_titulo}."
    )
    data = {
        "tipo": "contrato_creado",
        "id_contrato": str(instance.id_contrato),
        "codigo_contrato": instance.codigo_contrato,
        "propiedad_id": str(instance.propiedad_id),
    }

    print(
        f"DEBUG: Enviando notificacion push de contrato "
        f"{instance.codigo_contrato} al topic clientes"
    )

    FirebaseService.send_topic_notification(
        topic='clientes',
        title=title,
        body=body,
        data=data,
    )
