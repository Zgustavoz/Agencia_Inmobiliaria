import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String selectedRole = "Agent"; // Estado para el selector de rol

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
            /// --- HEADER ---
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

            /// --- SELECTOR DE ROL ---
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

            /// --- SECCIÓN: USUARIOS TABLE DETAILS ---
            _buildSectionTitle(
              "DATOS PERSONALES",
              "Información básica del usuario",
            ),
            Row(
              children: [
                Expanded(child: _buildInput("Nombres", "Ej. Juan")),
                const SizedBox(width: 12),
                Expanded(child: _buildInput("Apellidos", "Ej. Pérez")),
              ],
            ),
            _buildInput(
              "Email",
              "profesional@architect.com",
              icon: Icons.email_outlined,
            ),
            _buildInput(
              "Teléfono",
              "+591 ...",
              icon: Icons.phone_android,
              helper: "Teléfono inválido",
              isError: false,
            ),

            const SizedBox(height: 32),

            /// --- SECCIÓN: PERFIL Y CREDENCIALES ---
            _buildSectionTitle("PERFIL Y CREDENCIALES", "Acceso al sistema"),
            _buildInput("Usuario", "jperez_pro", icon: Icons.person_outline),
            _buildInput(
              "Contraseña",
              "••••••••",
              icon: Icons.lock_outline,
              isPassword: true,
            ),
            _buildInput(
              "Confirmar Contraseña",
              "••••••••",
              icon: Icons.lock_reset,
              isPassword: true,
            ),

            const SizedBox(height: 32),

            /// --- SECCIÓN: DETALLES PROFESIONALES ---
            _buildSectionTitle(
              "DETALLES DEL PERFIL PROFESIONAL",
              "Información de validación",
            ),
            _buildInput(
              "CI (Cédula de Identidad)",
              "1234567 LP",
              icon: Icons.badge_outlined,
            ),
            _buildInput(
              "Dirección",
              "Calle Ficticia #123",
              icon: Icons.location_on_outlined,
              helper: "Selecciona una dirección válida",
            ),
            _buildInput(
              "Ocupación",
              "Arquitecto / Ingeniero",
              icon: Icons.work_outline,
              helper: "Requerido",
            ),
            _buildInput(
              "Fecha de Nacimiento",
              "DD/MM/AAAA",
              icon: Icons.calendar_today_outlined,
            ),

            const SizedBox(height: 40),

            /// --- BOTÓN FINAL ---
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
                onPressed: () {},
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

  /// Widget para Títulos de Sección
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

  /// Widget para Inputs personalizados
  Widget _buildInput(
    String label,
    String hint, {
    IconData? icon,
    bool isPassword = false,
    String? helper,
    bool isError = false,
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

  /// Widget para el Selector de Rol (Toggle)
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
