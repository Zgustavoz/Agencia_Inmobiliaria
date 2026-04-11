class Usuario {
  final int id;
  final String username;
  final String email;
  final String nombres;
  final String apellidos;
  final String telefono;
  final String? fotoUrl;

  Usuario({
    required this.id,
    required this.username,
    required this.email,
    required this.nombres,
    required this.apellidos,
    required this.telefono,
    this.fotoUrl,
  });

  // De JSON (Django) a Objeto (Flutter)
  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      nombres: json['nombres'] ?? '',
      apellidos: json['apellidos'] ?? '',
      telefono: json['telefono'] ?? '',
      fotoUrl: json['foto_url'],
    );
  }

  // De Objeto (Flutter) a JSON (Para enviar a Django)
  Map<String, dynamic> toJson() {
    return {
      "username": username,
      "email": email,
      "nombres": nombres,
      "apellidos": apellidos,
      "telefono": telefono,
      // No enviamos el ID en el body porque suele ir en la URL
    };
  }
}
