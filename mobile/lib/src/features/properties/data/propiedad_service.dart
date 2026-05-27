import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';

class PropiedadService {
  static String get baseUrl => "${AppConfig.apiUrl}/api/inmuebles/propiedades/";

  // 1. Tu método actual se queda intacto tal y como lo tenías
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

  // 🛠️ NUEVO MÉTODO: Adaptado perfectamente a tu lógica y estructura de parseo
  static Future<List<Propiedad>> buscarPropiedadesFiltradas({
    String? modalidad,
    String? tipoInmueble,
    String? busquedaLibre,
  }) async {
    // 1. Preparamos los parámetros Query de forma dinámica
    final Map<String, String> queryParameters = {
      "publicado_movil":
          "true", // Filtro base para que solo busque lo activo en móvil
    };

    // 2. Si el usuario seleccionó o escribió filtros, los agregamos al mapa
    // Cambia las llaves de la izquierda si en tu backend se llaman distinto (ej: modalidad_operacion)
    if (modalidad != null && modalidad.isNotEmpty) {
      queryParameters['modalidad'] = modalidad;
    }
    if (tipoInmueble != null && tipoInmueble.isNotEmpty) {
      queryParameters['tipo_inmueble'] = tipoInmueble;
    }
    if (busquedaLibre != null && busquedaLibre.isNotEmpty) {
      queryParameters['search'] = busquedaLibre;
    }

    // 3. Construimos la URL final inyectando los queryParameters de forma segura
    final url = Uri.parse(baseUrl).replace(queryParameters: queryParameters);

    print("--- DEBUG BÚSQUEDA FILTRADA ---");
    print("URL DE PETICIÓN: $url");

    try {
      final response = await http.get(
        url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      );

      print("CÓDIGO DE RESPUESTA: ${response.statusCode}");
      print("CUERPO DE RESPUESTA: ${response.body}");

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));

        // Mantenemos tu excelente lógica defensiva por si viene paginado en Django ('results')
        List<dynamic> results;
        if (data is Map && data.containsKey('results')) {
          results = data['results'];
        } else if (data is List) {
          results = data;
        } else {
          results = [];
        }

        print("CANTIDAD DE PROPIEDADES FILTRADAS MAPEADAS: ${results.length}");
        return results.map((json) => Propiedad.fromJson(json)).toList();
      } else {
        print("ERROR EN SERVIDOR: ${response.body}");
        throw Exception("Error al filtrar propiedades: ${response.statusCode}");
      }
    } catch (e) {
      print("ERROR CRÍTICO EN buscarPropiedadesFiltradas: $e");
      return [];
    }
  }
}
