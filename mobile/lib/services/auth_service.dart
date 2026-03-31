import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = "http://TU_IP:8000/api";

  static Future login(String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/login/"),
      body: {"email": email, "password": password},
    );

    return jsonDecode(response.body);
  }
}
