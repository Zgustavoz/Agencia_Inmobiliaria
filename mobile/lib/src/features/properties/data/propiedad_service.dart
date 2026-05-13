import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';

class PropiedadService {
  static String get baseUrl => "${AppConfig.apiUrl}/api/inmuebles/propiedades/";

  static Future<List<Propiedad>> getPropiedadesDestacadas() async {
    final url = "$baseUrl?destacada=true&publicado_movil=true";
    print("--- DEBUG PROPIEDADES ---");
    print("URL DE PETICIÓN: $url");
    
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      );

      print("CÓDIGO DE RESPUESTA: ${response.statusCode}");
      print("CUERPO DE RESPUESTA: ${response.body}");

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        
        List<dynamic> results;
        if (data is Map && data.containsKey('results')) {
          results = data['results'];
        } else if (data is List) {
          results = data;
        } else {
          results = [];
        }

        print("CANTIDAD DE PROPIEDADES MAPEADAS: ${results.length}");
        return results.map((json) => Propiedad.fromJson(json)).toList();
      } else {
        print("ERROR EN SERVIDOR: ${response.body}");
        throw Exception("Error al cargar propiedades: ${response.statusCode}");
      }
    } catch (e) {
      print("ERROR CRÍTICO EN PropiedadService: $e");
      return [];
    }
  }
}
