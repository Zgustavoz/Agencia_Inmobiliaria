from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='modulo_inmuebles.Propiedad')
def notificar_nueva_propiedad(sender, instance, created, **kwargs):
    if not created:
        return

    from django.contrib.auth import get_user_model
    from notificaciones.models import Notificacion, DispositivoFCM
    from notificaciones.services import enviar_push

    Usuario = get_user_model()
    usuarios = list(Usuario.objects.filter(estado=True))

    titulo = 'Nueva propiedad disponible'
    cuerpo = f'{instance.titulo} — {instance.modalidad_operacion}'

    Notificacion.objects.bulk_create([
        Notificacion(destinatario=u, titulo=titulo, cuerpo=cuerpo, tipo='propiedad')
        for u in usuarios
    ])

    tokens = list(
        DispositivoFCM.objects.filter(usuario__in=usuarios, activo=True)
        .values_list('token', flat=True)
    )
    enviar_push(tokens=tokens, titulo=titulo, cuerpo=cuerpo, data={'tipo': 'propiedad', 'id': str(instance.pk)})
