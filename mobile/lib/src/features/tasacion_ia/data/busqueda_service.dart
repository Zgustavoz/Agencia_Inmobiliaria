// busqueda_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';

class BusquedaIAService {
  static String get baseUrl =>
      "${AppConfig.apiUrl}/api/tasacion-ia/busqueda-semantica/";

  Future<Map<String, dynamic>> enviarBusqueda({
    required String token,
    String? texto,
    String? audioPath,
  }) async {
    var request = http.MultipartRequest('POST', Uri.parse(baseUrl));
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Accept': 'application/json',
    });

    if (texto != null && texto.isNotEmpty) {
      request.fields['mensaje_texto'] = texto;
    }

    if (audioPath != null) {
      request.files.add(
        await http.MultipartFile.fromPath('audio_busqueda', audioPath),
      );
    }

    try {
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201 || response.statusCode == 200) {
        // Decodificamos la respuesta una sola vez
        final Map<String, dynamic> dataDecodificada = json.decode(
          utf8.decode(response.bodyBytes),
        );

        print("========== SERVICIO: RESPUESTA RECIBIDA DEL BACKEND ==========");
        print("ID Búsqueda: ${dataDecodificada['busqueda_id']}");
        print("IA Entendió: ${dataDecodificada['ia_entendio']}");
        print("Total Encontrados: ${dataDecodificada['resultados_count']}");
        print(
          "===============================================================",
        );

        // Retornamos directamente el mapa ya procesado
        return dataDecodificada;
      } else {
        throw Exception("Error ${response.statusCode}: ${response.body}");
      }
    } catch (e) {
      print("Error de conexión en búsqueda: $e");
      rethrow;
    }
  }
}
