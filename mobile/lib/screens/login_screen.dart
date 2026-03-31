import 'dart:ui';
import 'package:flutter/material.dart';
import 'register_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Fondo degradado base
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
                        const SizedBox(height: 16),
                        // Badge "Agents and Admins Only"
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDBE1FF),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            "Vuelvete un cliente",
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF00174B),
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                        const SizedBox(height: 32),

                        _buildLabel("Usuaio"),
                        _buildTextField(
                          hint: "xxxx@architecthq.com",
                          icon: Icons.alternate_email,
                        ),

                        const SizedBox(height: 20),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildLabel("contraseña"),
                            TextButton(
                              onPressed: () {},
                              child: const Text(
                                "olvidaste tu contraseña?",
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        _buildTextField(
                          hint: "••••••••",
                          icon: Icons.lock,
                          isPassword: true,
                        ),

                        const SizedBox(height: 20),

                        // Botón con Gradiente y Sombra Proyectada
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            gradient: const LinearGradient(
                              colors: [Color(0xFF004AC6), Color(0xFF2563EB)],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF004AC6).withOpacity(0.3),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "Iniciar Sesion",
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
                        // ... (debajo del botón de Sign In)
                        const SizedBox(height: 24),

                        // Divisor con texto "Partner Access" (como en tu HTML)
                        Row(
                          children: [
                            Expanded(
                              child: Divider(
                                color: const Color(0xFF737686).withOpacity(0.2),
                              ),
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
                              child: Divider(
                                color: const Color(0xFF737686).withOpacity(0.2),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // Enlace a Registro
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "No tienes una cuenta?",
                              style: TextStyle(
                                color: Color(0xFF434655),
                                fontSize: 14,
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                // Navegación a la pantalla de registro
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const RegisterScreen(),
                                  ),
                                );
                              },
                              child: const Text(
                                "Registrate aqui",
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
  }) {
    return TextField(
      obscureText: isPassword,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: const Color(0xFF737686), size: 20),
        suffixIcon: isPassword
            ? const Icon(
                Icons.visibility_outlined,
                color: Color(0xFF737686),
                size: 20,
              )
            : null,
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
}
