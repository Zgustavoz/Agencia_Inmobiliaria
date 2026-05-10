import os
import logging

logger = logging.getLogger(__name__)

_firebase_app = None


def _get_app():
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    try:
        import firebase_admin
        from firebase_admin import credentials
        from django.conf import settings

        if firebase_admin._apps:
            _firebase_app = firebase_admin.get_app()
            return _firebase_app

        cred_path = getattr(settings, 'FIREBASE_SERVICE_ACCOUNT', None)
        if not cred_path or not os.path.exists(cred_path):
            logger.warning("Firebase: service account no encontrado en '%s'", cred_path)
            return None

        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app

    except ImportError:
        logger.warning("firebase-admin no instalado — notificaciones push deshabilitadas")
        return None
    except Exception as exc:
        logger.error("Firebase init error: %s", exc)
        return None


def enviar_push(tokens: list, titulo: str, cuerpo: str, data: dict = None):
    if not tokens:
        return

    if _get_app() is None:
        return

    try:
        from firebase_admin import messaging

        messages = [
            messaging.Message(
                notification=messaging.Notification(title=titulo, body=cuerpo),
                data={k: str(v) for k, v in (data or {}).items()},
                token=token,
            )
            for token in tokens
        ]

        response = messaging.send_each(messages)
        logger.info("FCM: %d éxitos, %d fallos", response.success_count, response.failure_count)

        from notificaciones.models import DispositivoFCM
        invalid = [tokens[i] for i, r in enumerate(response.responses) if not r.success]
        if invalid:
            DispositivoFCM.objects.filter(token__in=invalid).update(activo=False)

    except Exception as exc:
        logger.error("FCM send error: %s", exc)
