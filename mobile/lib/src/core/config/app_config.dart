import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String get apiUrl => dotenv.env['API_URL'] ?? 'http://localhost:8000/api/v1';
  
  // Agrega aquí más variables de entorno si las necesitas
}
