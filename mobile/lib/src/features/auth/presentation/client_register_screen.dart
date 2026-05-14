import 'dart:ui';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';

class ClientRegisterScreen extends StatefulWidget {
  const ClientRegisterScreen({super.key});

  @override
  State<ClientRegisterScreen> createState() => _ClientRegisterScreenState();
}

class _ClientRegisterScreenState extends State<ClientRegisterScreen> {
  final TextEditingController _nombresCtrl = TextEditingController();
  final TextEditingController _apellidosCtrl = TextEditingController();
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _telefonoCtrl = TextEditingController();
  final TextEditingController _whatsappCtrl = TextEditingController();
  final TextEditingController _usernameCtrl = TextEditingController();
  final TextEditingController _passwordCtrl = TextEditingController();
  final TextEditingController _confirmPasswordCtrl = TextEditingController();
  final TextEditingController _ciCtrl = TextEditingController();
  final TextEditingController _direccionCtrl = TextEditingController();
  final TextEditingController _ocupacionCtrl = TextEditingController();
  final TextEditingController _fechaNacCtrl = TextEditingController();

  bool _isLoading = false;

  Future<void> registrarCliente() async {
    if (_passwordCtrl.text != _confirmPasswordCtrl.text) {
      _mostrarSnackBar('Las contraseñas no coinciden', isError: true);
      return;
    }

    if (_passwordCtrl.text.length < 8) {
      _mostrarSnackBar(
        'La contraseña debe tener al menos 8 caracteres',
        isError: true,
      );
      return;
    }

    setState(() => _isLoading = true);

    final url = Uri.parse(
      '${AppConfig.apiUrl}/gestion_usuarios/auth/registro-cliente/',
    );

    try {
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json; charset=UTF-8'},
            body: jsonEncode({
              "tenant_id": 1,
              "username": _usernameCtrl.text.trim(),
              "email": _emailCtrl.text.trim(),
              "password": _passwordCtrl.text,
              "password2": _confirmPasswordCtrl.text,
              "nombres": _nombresCtrl.text.trim(),
              "apellidos": _apellidosCtrl.text.trim(),
              "telefono": _telefonoCtrl.text.trim(),
              "whatsapp": _whatsappCtrl.text.trim(),
              "ci": _ciCtrl.text.trim(),
              "direccion": _direccionCtrl.text.trim(),
              "ocupacion": _ocupacionCtrl.text.trim(),
              "fecha_nacimiento": _fechaNacCtrl.text.trim(),
            }),
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 201) {
        _mostrarSnackBar('¡Bienvenido! Registro exitoso.', isError: false);
        Navigator.pop(context);
      } else {
        final errorData = jsonDecode(response.body);
        _mostrarSnackBar('Error: ${errorData.toString()}', isError: true);
      }
    } catch (e) {
      _mostrarSnackBar('Error de conexión: $e', isError: true);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _mostrarSnackBar(String mensaje, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensaje),
        backgroundColor: isError ? Colors.redAccent : const Color(0xFF004AC6),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Future<void> _seleccionarFecha(BuildContext context) async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      locale: const Locale("es", "BO"),
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
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFDBE1FF), Color(0xFFF7F9FB)],
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(
                      Icons.arrow_back_ios,
                      color: Color(0xFF191C1E),
                    ),
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                      child: Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.4),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Nuevo Cliente",
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF191C1E),
                                letterSpacing: -1,
                              ),
                            ),
                            const Text(
                              "Completa tus datos para empezar",
                              style: TextStyle(
                                color: Color(0xFF434655),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 32),

                            _buildSectionHeader("DATOS PERSONALES"),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildField(
                                    "NOMBRES",
                                    "Ej. Carlos",
                                    _nombresCtrl,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildField(
                                    "APELLIDOS",
                                    "Ej. Paz",
                                    _apellidosCtrl,
                                  ),
                                ),
                              ],
                            ),
                            _buildField(
                              "EMAIL",
                              "carlos@gmail.com",
                              _emailCtrl,
                              icon: Icons.email_outlined,
                            ),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildField(
                                    "TELÉFONO",
                                    "700...",
                                    _telefonoCtrl,
                                    icon: Icons.phone,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildField(
                                    "WHATSAPP",
                                    "700...",
                                    _whatsappCtrl,
                                    icon: Icons.message,
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),
                            _buildSectionHeader("DETALLES DE PERFIL"),
                            _buildField(
                              "CI / DOCUMENTO",
                              "1234567",
                              _ciCtrl,
                              icon: Icons.badge_outlined,
                            ),
                            _buildField(
                              "DIRECCIÓN",
                              "Zona Central, Calle X",
                              _direccionCtrl,
                              icon: Icons.location_on_outlined,
                            ),
                            _buildField(
                              "OCUPACIÓN",
                              "Profesión / Oficio",
                              _ocupacionCtrl,
                              icon: Icons.work_outline,
                            ),

                            GestureDetector(
                              onTap: () => _seleccionarFecha(context),
                              child: AbsorbPointer(
                                child: _buildField(
                                  "FECHA DE NACIMIENTO",
                                  "AAAA-MM-DD",
                                  _fechaNacCtrl,
                                  icon: Icons.calendar_today,
                                ),
                              ),
                            ),

                            const SizedBox(height: 20),
                            _buildSectionHeader("SEGURIDAD"),
                            _buildField(
                              "USUARIO",
                              "mi_usuario",
                              _usernameCtrl,
                              icon: Icons.person_outline,
                            ),
                            _buildField(
                              "CONTRASEÑA",
                              "••••••••",
                              _passwordCtrl,
                              icon: Icons.lock_outline,
                              isPassword: true,
                            ),
                            _buildField(
                              "CONFIRMAR CONTRASEÑA",
                              "••••••••",
                              _confirmPasswordCtrl,
                              icon: Icons.lock_reset,
                              isPassword: true,
                            ),

                            const SizedBox(height: 40),
                            _buildSubmitButton(),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_isLoading)
            Container(
              color: Colors.black26,
              child: const Center(
                child: CircularProgressIndicator(color: Color(0xFF004AC6)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w900,
          color: Color(0xFF004AC6),
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  Widget _buildField(
    String label,
    String hint,
    TextEditingController ctrl, {
    IconData? icon,
    bool isPassword = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: Color(0xFF737686),
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: ctrl,
            obscureText: isPassword,
            style: const TextStyle(fontSize: 14),
            decoration: InputDecoration(
              prefixIcon: icon != null
                  ? Icon(icon, size: 18, color: const Color(0xFF737686))
                  : null,
              hintText: hint,
              hintStyle: TextStyle(
                color: const Color(0xFF737686).withOpacity(0.4),
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(
                vertical: 14,
                horizontal: 16,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: const Color(0xFFC3C6D7).withOpacity(0.2),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: const Color(0xFFC3C6D7).withOpacity(0.2),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: const LinearGradient(
          colors: [Color(0xFF004AC6), Color(0xFF2563EB)],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF004AC6).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : registrarCliente,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: const Text(
          "CREAR CUENTA",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 14,
            letterSpacing: 1,
          ),
        ),
      ),
    );
  }
}
