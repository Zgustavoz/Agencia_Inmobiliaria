import 'package:flutter/material.dart';
import 'package:mobile/src/features/auth/data/usuario_model.dart';
import 'package:mobile/src/shared/services/notification_service.dart';
import 'package:mobile/src/core/config/app_config.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class UserProvider with ChangeNotifier {
  Usuario? _usuario;
  String? _token;

  Usuario? get usuario => _usuario;
  String? get token => _token;

  Future<void> setUser(Usuario user, String token) async {
    _usuario = user;
    _token = token;
    notifyListeners();
    
    // Registrar el token de Firebase automáticamente al iniciar sesión
    // NO usamos await aquí para que el login no se quede trabado si Firebase tarda
    _registrarDispositivoEnBackend().catchError((e) {
      debugPrint('Error en registro de dispositivo: $e');
    });
  }

  Future<void> _registrarDispositivoEnBackend() async {
    if (_token == null) return;

    final fcmToken = await NotificationService.getToken();
    if (fcmToken == null) {
      print('No se obtuvo token FCM; no se registrara dispositivo.');
      return;
    }

    try {
      final url = Uri.parse('${AppConfig.apiUrl}/gestion_usuarios/auth/fcm-token/');
      print('Registrando token FCM en backend: $url');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $_token',
        },
        body: jsonEncode({
          'fcm_token': fcmToken,
          'dispositivo_id': 'mobile_app', // Opcional: podrías usar device_info_plus para algo más único
        }),
      );

      if (response.statusCode == 201) {
        print('Dispositivo registrado en FCM backend exitosamente');
      } else {
        print('Error al registrar dispositivo en FCM (${response.statusCode}): ${response.body}');
      }
    } catch (e) {
      print('Error de conexión al registrar FCM: $e');
    }
  }
}
