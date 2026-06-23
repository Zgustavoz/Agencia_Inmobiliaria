import 'dart:async';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

// Función global para manejar mensajes en segundo plano
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Asegúrate de inicializar Firebase si es necesario (generalmente ya lo está)
  print("Manejando mensaje en segundo plano: ${message.messageId}");
}

class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotificationsPlugin = FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    try {
      // 1. Solicitar permisos
      NotificationSettings settings = await _firebaseMessaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        print('Usuario otorgó permiso para notificaciones');
      }

      if (!kIsWeb) {
        try {
          await _firebaseMessaging.subscribeToTopic('clientes');
          print('Suscrito al topic de contratos/clientes');
        } catch (e) {
          print('Error suscribiendo al topic clientes: $e');
        }
      }

      // 2. Configurar notificaciones locales (Solo para móviles)
      if (!kIsWeb) {
        const AndroidInitializationSettings initializationSettingsAndroid =
            AndroidInitializationSettings('@mipmap/ic_launcher');
        
        const InitializationSettings initializationSettings = InitializationSettings(
          android: initializationSettingsAndroid,
          iOS: DarwinInitializationSettings(),
        );

        await _localNotificationsPlugin.initialize(initializationSettings);
        
        // Registrar el manejador de segundo plano
        FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      }

      // 3. Escuchar mensajes en primer plano (Foreground)
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        print('Mensaje recibido en primer plano: ${message.notification?.title}');
        if (!kIsWeb) {
          _showLocalNotification(message);
        }
      });

      // 4. Manejar clics en notificaciones
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        print('Notificación abierta desde segundo plano: ${message.data}');
      });
      
    } catch (e) {
      print("Error inicializando NotificationService: $e");
    }
  }

  static Future<String?> getToken() async {
    try {
      // En Web se necesita la VAPID key si se usa getToken
      // String? token = await _firebaseMessaging.getToken(vapidKey: 'TU_VAPID_KEY');
      
      // Agregamos un timeout de 5 segundos para que no bloquee toda la app si falla
      String? token = await _firebaseMessaging.getToken().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          print("Timeout obteniendo FCM Token");
          return null;
        },
      );
      
      if (token != null) {
        print("FCM Token: $token");
      }
      return token;
    } catch (e) {
      print("Error obteniendo FCM Token: $e");
      return null;
    }
  }

  static Future<void> _showLocalNotification(RemoteMessage message) async {
    if (kIsWeb) return;

    const AndroidNotificationDetails androidDetail = AndroidNotificationDetails(
      'visitas_channel', // id
      'Notificaciones de Visitas', // name
      importance: Importance.max,
      priority: Priority.high,
    );

    const NotificationDetails platformChannelSpecifics = NotificationDetails(
      android: androidDetail,
      iOS: DarwinNotificationDetails(),
    );

    await _localNotificationsPlugin.show(
      message.hashCode,
      message.notification?.title,
      message.notification?.body,
      platformChannelSpecifics,
      payload: message.data.toString(),
    );
  }
}
