// tasacion_service.dart
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';

class TasacionIAService {
  // Cargamos la URL desde el .env. Asegúrate de tener API_BASE_URL=http://TU_IP:8000 en tu archivo .env
  static String get baseUrl => "${AppConfig.apiUrl}/api/tasacion-ia/tasar/";

  Future<Map<String, dynamic>> enviarConsulta({
    required String token,
    File? imagen,
    String? audioPath,
    String? texto,
  }) async {
    var request = http.MultipartRequest('POST', Uri.parse(baseUrl));
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Accept': 'application/json',
    });

    if (imagen != null) {
      request.files.add(
        await http.MultipartFile.fromPath('imagen_referencia', imagen.path),
      );
    }
    if (audioPath != null) {
      request.files.add(
        await http.MultipartFile.fromPath('audio_descripcion', audioPath),
      );
    }
    if (texto != null && texto.isNotEmpty) {
      request.fields['mensaje_usuario'] = texto;
    }

    try {
      // 6. Enviar y procesar respuesta
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return json.decode(utf8.decode(response.bodyBytes));
      } else {
        // Imprimimos el error del servidor para debuguear
        print("Error del Servidor: ${response.body}");
        throw Exception("Error ${response.statusCode}: ${response.body}");
      }
    } catch (e) {
      print("Error de conexión: $e");
      rethrow;
    }
  }
}
