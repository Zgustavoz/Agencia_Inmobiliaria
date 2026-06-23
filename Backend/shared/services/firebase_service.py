import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
import json
import os

class FirebaseService:
    _initialized = False

    @classmethod
    def initialize(cls):
        if not cls._initialized:
            firebase_creds_json = settings.FIREBASE_SERVICE_ACCOUNT_JSON
            if not firebase_creds_json:
                print("Firebase Service Account JSON no configurado.")
                return

            try:
                # Si es una ruta de archivo
                if os.path.exists(firebase_creds_json):
                    cred = credentials.Certificate(firebase_creds_json)
                else:
                    # Si es el contenido JSON directamente
                    creds_dict = json.loads(firebase_creds_json)
                    cred = credentials.Certificate(creds_dict)
                
                firebase_admin.initialize_app(cred)
                cls._initialized = True
                print("Firebase Admin inicializado correctamente.")
            except Exception as e:
                print(f"Error inicializando Firebase Admin: {e}")

    @staticmethod
    def send_push_notification(user, title, body, data=None):
        FirebaseService.initialize()
        if not FirebaseService._initialized:
            print("ERROR: Firebase no está inicializado.")
            return

        # Obtener tokens del usuario
        devices = user.dispositivos_fcm.all()
        tokens = [device.fcm_token for device in devices]

        print(f"DEBUG: Intentando enviar notificación a {user.username}. Tokens encontrados: {len(tokens)}")

        if not tokens:
            print(f"DEBUG: No hay tokens registrados para el usuario {user.username}")
            return

        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            tokens=tokens,
        )

        try:
            # send_multicast está obsoleto y usa el endpoint /batch (que devuelve 404 porque Google lo retiró)
            # send_each_for_multicast es el reemplazo que usa la API HTTP v1 correctamente
            response = messaging.send_each_for_multicast(message)
            print(f"DEBUG: Firebase response: success={response.success_count}, failure={response.failure_count}")
            for index, res in enumerate(response.responses):
                if not res.success:
                    print(f"DEBUG: Error en token {index}: {res.exception}")
        except Exception as e:
            print(f"Error enviando notificaciones push: {e}")

    @staticmethod
    def send_topic_notification(topic, title, body, data=None):
        FirebaseService.initialize()
        if not FirebaseService._initialized:
            print("ERROR: Firebase no está inicializado.")
            return

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            topic=topic,
        )

        try:
            response = messaging.send(message)
            print(f"DEBUG: Firebase topic response: {response}")
        except Exception as e:
            print(f"Error enviando notificacion por topic: {e}")
