class AppConfig {
  // ─── CAMBIA SOLO AQUI cuando cambies de red ──────────────────
  static const String host = '192.168.1.5';
  static const int port = 8000;
  // ─────────────────────────────────────────────────────────────

  static String get baseUrl => 'http://$host:$port';
  static String get apiUsuarios => '$baseUrl/gestion_usuarios';
}
