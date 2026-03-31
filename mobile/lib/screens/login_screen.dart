import 'dart:ui';
import 'package:flutter/material.dart';
import 'register_screen.dart';
import 'destacados_screen.dart'; // Asegúrate de crear este archivo
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Controladores para capturar los datos
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  Future<void> _intentarLogin() async {
    final String email = _userController.text;
    final String password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _mostrarError("Por favor, llena todos los campos");
      return;
    }

    try {
      // Reemplaza con la URL de tu API de Django
      // Si usas emulador: http://10.0.2.2:8000/api/login/
      final url = Uri.parse(
        'http://localhost:8000/gestion_usuarios/auth/login/',
      );

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': email, // O 'email' según como lo tengas en Django
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        // Si Django devuelve 200 OK y quizás un Token
        final data = jsonDecode(response.body);
        print("Login exitoso: ${data['token']}");

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const DestacadosScreen()),
        );
      } else {
        // Si el usuario no existe en la BD o la clave está mal
        _mostrarError("Usuario o contraseña incorrectos en la BD");
      }
    } catch (e) {
      _mostrarError("Error de conexión con el servidor Django");
    }
  }

  void _mostrarError(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(mensaje), backgroundColor: Colors.redAccent),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Fondo degradado base igual al tuyo
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFDBE1FF), Color(0xFFF7F9FB)],
              ),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                  child: Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withOpacity(0.4)),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Acceso Profesional",
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF191C1E),
                            letterSpacing: -1,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Ingresa a tu panel inmobiliario",
                          style: TextStyle(
                            color: Color(0xFF434655),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 32),

                        _buildLabel("USUARIO"),
                        _buildTextField(
                          controller: _userController,
                          hint: "ejemplo@architecthq.com",
                          icon: Icons.alternate_email,
                        ),

                        const SizedBox(height: 20),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildLabel("CONTRASEÑA"),
                            TextButton(
                              onPressed: () {},
                              child: const Text(
                                "¿olvidaste tu contraseña?",
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        _buildTextField(
                          controller: _passwordController,
                          hint: "••••••••",
                          icon: Icons.lock,
                          isPassword: true,
                        ),

                        const SizedBox(height: 32),

                        // Botón de Iniciar Sesión con tu diseño original
                        GestureDetector(
                          onTap: _intentarLogin,
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              gradient: const LinearGradient(
                                colors: [Color(0xFF004AC6), Color(0xFF2563EB)],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(
                                    0xFF004AC6,
                                  ).withOpacity(0.3),
                                  blurRadius: 15,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Text(
                                    "Iniciar Sesión",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(
                                    Icons.arrow_forward,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 24),
                        _buildPartnerDivider(),
                        const SizedBox(height: 24),

                        // Enlace a Registro
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text("¿No tienes una cuenta?"),
                            TextButton(
                              onPressed: () {
                                // CAMBIO: Navegación directa a la clase RegisterScreen
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const RegisterScreen(),
                                  ),
                                );
                              },
                              child: const Text(
                                "Regístrate aquí",
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF004AC6),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- Widgets Auxiliares ---

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          color: Color(0xFF737686),
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String hint,
    required IconData icon,
    bool isPassword = false,
    required TextEditingController controller,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: const Color(0xFF737686), size: 20),
        hintText: hint,
        hintStyle: TextStyle(color: const Color(0xFF737686).withOpacity(0.5)),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: const Color(0xFFC3C6D7).withOpacity(0.3),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: const Color(0xFFC3C6D7).withOpacity(0.3),
          ),
        ),
      ),
    );
  }

  Widget _buildPartnerDivider() {
    return Row(
      children: [
        Expanded(
          child: Divider(color: const Color(0xFF737686).withOpacity(0.2)),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            "PARTNER ACCESS",
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              color: Color(0xFF737686),
              letterSpacing: 2,
            ),
          ),
        ),
        Expanded(
          child: Divider(color: const Color(0xFF737686).withOpacity(0.2)),
        ),
      ],
    );
  }
}
