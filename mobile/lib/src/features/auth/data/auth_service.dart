import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/features/auth/data/usuario_model.dart';

class AuthService {
  // Base URL corregida según tus logs de Django
  static const String baseUrl =
      "https://agencia-inmobiliaria-7982.onrender.com/gestion_usuarios";

  // 1. LOGIN: Ahora enviamos JSON (necesario para @api_view en Django)
  static Future<Map<String, dynamic>> login(
    String username,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/auth/login/"), // Ruta completa según tus logs
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "username": username, // Django usa username por defecto
        "password": password,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      print("Error Login: ${response.body}");
      throw Exception("Error al iniciar sesión");
    }
  }

  // 2. ACTUALIZAR: Con la ruta y el token corregidos
  static Future<bool> actualizarPerfil(Usuario usuario, String token) async {
    // Es vital que termine en / para que Django no haga redirect
    final url = Uri.parse("$baseUrl/usuarios/${usuario.id}/");

    print("--- DEBUG UPDATE ---");
    print("URL: $url");
    print(
      "TOKEN: Bearer ${token.substring(0, 5)}...",
    ); // Solo para verificar que llega

    final response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Agrega esto
        "Authorization": "Bearer $token",
      },
      body: jsonEncode(usuario.toJson()),
    );
    print("CÓDIGO DE RESPUESTA: ${response.statusCode}");
    print("DETALLE DEL SERVIDOR: ${response.body}");

    // Django devuelve 200 (OK) o 201 (Created) si todo sale bien
    return response.statusCode == 200 || response.statusCode == 201;
  }
}
