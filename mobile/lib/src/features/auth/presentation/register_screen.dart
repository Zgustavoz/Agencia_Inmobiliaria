import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String selectedRole = "Agent";
  final TextEditingController _nombresCtrl = TextEditingController();
  final TextEditingController _apellidosCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _telefonoCtrl = TextEditingController();
  final TextEditingController _usernameCtrl = TextEditingController();
  final TextEditingController _passwordCtrl = TextEditingController();
  final TextEditingController _confirmPasswordCtrl = TextEditingController();
  final TextEditingController _ciCtrl = TextEditingController();
  final TextEditingController _direccionCtrl = TextEditingController();
  final TextEditingController _ocupacionCtrl = TextEditingController();
  final TextEditingController _fechaNacCtrl = TextEditingController();

  Future<void> registrarUsuario() async {
    if (_passwordCtrl.text != _confirmPasswordCtrl.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Las contraseñas no coinciden')),
      );
      return;
    }

    if (_passwordCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('La contraseña no puede estar vacía')),
      );
      return;
    }

    final url = Uri.parse(
      '${AppConfig.apiUrl}/gestion_usuarios/auth/registro/',
    );

    List<int> rolesIds = selectedRole == "Admin" ? [1] : [2];

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "username": _usernameCtrl.text,
          "email": _emailCtrl.text,
          "password": _passwordCtrl.text,
          "password2": _confirmPasswordCtrl.text,
          "nombres": _nombresCtrl.text,
          "apellidos": _apellidosCtrl.text,
          "telefono": _telefonoCtrl.text,
          "ci": _ciCtrl.text,
          "direccion": _direccionCtrl.text,
          "ocupacion": _ocupacionCtrl.text,
          "fecha_nacimiento": _fechaNacCtrl.text,
          "roles_ids": rolesIds,
        }),
      );

      if (response.statusCode == 201) {
        print("¡Usuario creado con éxito!");
      } else {
        print("Error del servidor: ${response.body}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al registrar: ${response.body}')),
        );
      }
    } catch (e) {
      print("Error de conexión: $e");
    }
  }

  Future<void> _seleccionarFecha(BuildContext context) async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      locale: const Locale("es", "ES"),
    );

    if (picked != null) {
      setState(() {
        _fechaNacCtrl.text =
            "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FB),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.black),
        title: const Text(
          "Portal Profesional",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Únete a la élite arquitectónica",
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: Color(0xFF191C1E),
                letterSpacing: -1,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              "Registra tu perfil profesional para operar propiedades, clientes y oportunidades con una experiencia premium.",
              style: TextStyle(
                color: Color(0xFF434655),
                fontSize: 14,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),

            _buildSectionTitle(
              "REGISTRO DE PROFESIONAL",
              "Especifica tu rol (Agente o Administrador)",
            ),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFFECEEF0),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  _buildToggleOption("Agent"),
                  _buildToggleOption("Admin"),
                ],
              ),
            ),
            const SizedBox(height: 32),

            _buildSectionTitle(
              "DATOS PERSONALES",
              "Información básica del usuario",
            ),
            Row(
              children: [
                Expanded(
                  child: _buildInput(
                    "Nombres",
                    "Ej. Juan",
                    controller: _nombresCtrl,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildInput(
                    "Apellidos",
                    "Ej. Pérez",
                    controller: _apellidosCtrl,
                  ),
                ),
              ],
            ),
            _buildInput(
              "Email",
              "profesional@architect.com",
              icon: Icons.email_outlined,
              controller: _emailCtrl,
            ),
            _buildInput(
              "Teléfono",
              "+591 ...",
              icon: Icons.phone_android,
              controller: _telefonoCtrl,
            ),

            const SizedBox(height: 32),

            _buildSectionTitle("PERFIL Y CREDENCIALES", "Acceso al sistema"),
            _buildInput(
              "Usuario",
              "jperez_pro",
              icon: Icons.person_outline,
              controller: _usernameCtrl,
            ),
            _buildInput(
              "Contraseña",
              "••••••••",
              icon: Icons.lock_outline,
              isPassword: true,
              controller: _passwordCtrl,
            ),
            _buildInput(
              "Confirmar Contraseña",
              "••••••••",
              icon: Icons.lock_reset,
              isPassword: true,
              controller: _confirmPasswordCtrl,
            ),

            const SizedBox(height: 32),

            _buildSectionTitle(
              "DETALLES DEL PERFIL PROFESIONAL",
              "Información de validación",
            ),
            _buildInput(
              "CI (Cédula de Identidad)",
              "1234567 LP",
              icon: Icons.badge_outlined,
              controller: _ciCtrl,
            ),
            _buildInput(
              "Dirección",
              "Calle Ficticia #123",
              icon: Icons.location_on_outlined,
              controller: _direccionCtrl,
            ),
            _buildInput(
              "Ocupación",
              "Arquitecto / Ingeniero",
              icon: Icons.work_outline,
              controller: _ocupacionCtrl,
            ),
            GestureDetector(
              onTap: () => _seleccionarFecha(context),
              child: AbsorbPointer(
                child: _buildInput(
                  "Fecha de Nacimiento",
                  "Selecciona tu fecha",
                  icon: Icons.calendar_today_outlined,
                  controller: _fechaNacCtrl,
                  helper: "Formato requerido: AAAA-MM-DD",
                ),
              ),
            ),

            const SizedBox(height: 40),

            Container(
              width: double.infinity,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [Color(0xFF004AC6), Color(0xFF2563EB)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF004AC6).withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: registrarUsuario,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                ),
                child: const Text(
                  "Crear Cuenta Profesional",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w900,
            color: Color(0xFF004AC6),
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: const TextStyle(fontSize: 13, color: Colors.grey),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildInput(
    String label,
    String hint, {
    IconData? icon,
    bool isPassword = false,
    String? helper,
    bool isError = false,
    TextEditingController? controller,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFF737686),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            obscureText: isPassword,
            decoration: InputDecoration(
              prefixIcon: icon != null
                  ? Icon(icon, size: 20, color: const Color(0xFF737686))
                  : null,
              hintText: hint,
              hintStyle: TextStyle(
                color: Colors.grey.withOpacity(0.5),
                fontSize: 14,
              ),
              filled: true,
              fillColor: Colors.white,
              helperText: helper,
              helperStyle: TextStyle(
                color: isError ? Colors.red : Colors.grey,
                fontSize: 10,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey.shade200),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey.shade200),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggleOption(String label) {
    bool isActive = selectedRole == label;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => selectedRole = label),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isActive ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 5,
                    ),
                  ]
                : null,
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isActive
                  ? const Color(0xFF004AC6)
                  : const Color(0xFF737686),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
