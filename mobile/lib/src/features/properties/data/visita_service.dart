import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';
import 'package:mobile/src/features/properties/data/visita_model.dart';
import 'package:intl/intl.dart';

import 'package:mobile/src/features/properties/data/horario_model.dart';

class VisitaService {
  static String get baseUrl => "${AppConfig.apiUrl}/api/clientes/visitas/";
  static String get horariosUrl => "${AppConfig.apiUrl}/api/clientes/horarios-disponibilidad/";

  static Future<List<HorarioDisponibilidad>> getHorariosPropiedad(int propiedadId, String token) async {
    try {
      final response = await http.get(
        Uri.parse("$horariosUrl?propiedad_id=$propiedadId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        List<dynamic> results = (data is Map) ? data['results'] : data;
        return results.map((json) => HorarioDisponibilidad.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error obteniendo horarios: $e");
      return [];
    }
  }

  static Future<List<Visita>> getVisitasPropiedadFecha(int propiedadId, String fecha, String token) async {
    try {
      final response = await http.get(
        Uri.parse("$baseUrl?propiedad_id=$propiedadId&fecha_visita=$fecha"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );
      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        List<dynamic> results = (data is Map) ? data['results'] : data;
        return results.map((json) => Visita.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<Visita>> getMisVisitas(String token) async {
    try {
      final response = await http.get(
        Uri.parse(baseUrl),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        List<dynamic> results = (data is Map) ? data['results'] : data;
        return results.map((json) => Visita.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      print("Error en VisitaService: $e");
      return [];
    }
  }

  static Future<bool> solicitarVisita({
    required int clienteId,
    required int propiedadId,
    required String fecha,
    required String hora,
    required String comentario,
    required String token,
  }) async {
    try {
      DateTime start;
      try {
        start = DateFormat("HH:mm:ss").parse(hora);
      } catch (_) {
        start = DateFormat("HH:mm").parse(hora);
      }
      
      final end = start.add(const Duration(hours: 1));
      final horaInicioStr = DateFormat("HH:mm:ss").format(start);
      final horaFinStr = DateFormat("HH:mm:ss").format(end);

      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "propiedad": propiedadId,
          "fecha_visita": fecha,
          "hora_inicio": horaInicioStr,
          "hora_fin": horaFinStr,
          "comentario_cliente": comentario,
          "estado": "pendiente"
        }),
      );
      
      if (response.statusCode != 201 && response.statusCode != 200) {
        print("Error en servidor (${response.statusCode}): ${response.body}");
        return false;
      }
      return true;
    } catch (e) {
      print("Error solicitando visita: $e");
      return false;
    }
  }

  static Future<bool> actualizarVisita(int visitaId, Map<String, dynamic> data, String token) async {
    try {
      final response = await http.patch(
        Uri.parse("$baseUrl$visitaId/"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(data),
      );
      return response.statusCode == 200;
    } catch (e) {
      print("Error actualizando visita: $e");
      return false;
    }
  }
}
