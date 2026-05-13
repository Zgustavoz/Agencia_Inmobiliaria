import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';

/// Manejador de mensajes en background (top-level, fuera de la clase)
@pragma('vm:entry-point')
Future<void> _firebaseBackgroundHandler(RemoteMessage message) async {
  // Firebase ya inicializado por el framework en background
}

class NotificationService {
  static final _fcm = FirebaseMessaging.instance;
  static final _localNotif = FlutterLocalNotificationsPlugin();

  static const _channelId = 'inmobiliaria_channel';
  static const _channelName = 'Inmobiliaria';

  static Future<void> initialize() async {
    // Solicitar permiso
    await _fcm.requestPermission(alert: true, badge: true, sound: true);

    // Canal Android
    const androidChannel = AndroidNotificationChannel(
      _channelId,
      _channelName,
      description: 'Notificaciones de la Agencia Inmobiliaria',
      importance: Importance.high,
    );
    await _localNotif
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidChannel);

    // Inicializar plugin local
    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );
    await _localNotif.initialize(initSettings);

    // Manejador background
    FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundHandler);

    // Notificaciones en foreground
    FirebaseMessaging.onMessage.listen((message) {
      final notification = message.notification;
      if (notification == null) return;

      _localNotif.show(
        notification.hashCode,
        notification.title,
        notification.body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            _channelId,
            _channelName,
            importance: Importance.high,
            priority: Priority.high,
          ),
        ),
      );
    });
  }

  /// Obtiene el FCM token y lo registra en el backend
  static Future<void> registrarToken(String bearerToken) async {
    try {
      final token = await _fcm.getToken();
      if (token == null) return;

      await http.post(
        Uri.parse('${AppConfig.baseUrl}/api/notificaciones/registrar-token/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $bearerToken',
        },
        body: jsonEncode({'token': token, 'plataforma': 'android'}),
      );
    } catch (_) {
      // Silencioso — no bloquea el flujo de login
    }
  }
}
