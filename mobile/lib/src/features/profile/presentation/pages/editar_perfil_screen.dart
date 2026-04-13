import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
// REVISA QUE ESTAS RUTAS SEAN LAS DE TU PROYECTO:
import 'package:mobile/src/features/auth/logic/user_provider.dart';
import 'package:mobile/src/features/auth/data/usuario_model.dart';
import 'package:mobile/src/features/auth/data/auth_service.dart';

class EditarPerfilScreen extends StatefulWidget {
  const EditarPerfilScreen({super.key});

  @override
  State<EditarPerfilScreen> createState() => _EditarPerfilScreenState();
}

class _EditarPerfilScreenState extends State<EditarPerfilScreen> {
  // Estos controladores guardan lo que escribes en los cuadros
  late TextEditingController _nombreController;
  late TextEditingController _apellidoController;
  late TextEditingController _usernameController;
  late TextEditingController _emailController;
  late TextEditingController _telefonoController;

  @override
  void initState() {
    super.initState();
    // 1. Sacamos el usuario que está logueado actualmente del Provider
    final user = Provider.of<UserProvider>(context, listen: false).usuario;

    // 2. Llenamos los controladores con la info REAL del usuario
    _nombreController = TextEditingController(text: user?.nombres ?? "");
    _apellidoController = TextEditingController(text: user?.apellidos ?? "");
    _usernameController = TextEditingController(text: user?.username ?? "");
    _emailController = TextEditingController(text: user?.email ?? "");
    _telefonoController = TextEditingController(text: user?.telefono ?? "");
  }

  @override
  void dispose() {
    // Es buena práctica limpiar los controladores al salir
    _nombreController.dispose();
    _apellidoController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _telefonoController.dispose();
    super.dispose();
  }

  Future<void> _guardarCambios() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final usuarioActual = userProvider.usuario!;
    final token = userProvider.token!;

    // 3. Creamos el objeto con los NUEVOS datos de los cuadros de texto
    final usuarioEditado = Usuario(
      id: usuarioActual.id,
      username: _usernameController.text,
      email: _emailController.text,
      nombres: _nombreController.text,
      apellidos: _apellidoController.text,
      telefono: _telefonoController.text,
      fotoUrl: usuarioActual.fotoUrl,
    );

    try {
      // 4. Mandamos el PUT a Django usando tu AuthService
      bool exito = await AuthService.actualizarPerfil(usuarioEditado, token);

      if (exito) {
        // Actualizamos el Provider para que el Home también cambie el nombre
        userProvider.setUser(usuarioEditado, token);

        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("¡Perfil actualizado!")));
        Navigator.pop(context);
      } else {
        throw Exception("El servidor rechazó la actualización");
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Editar Perfil",
          style: TextStyle(color: Colors.black, fontSize: 18.sp),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFF16621)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(25.w),
        child: Column(
          children: [
            // Foto de perfil
            Center(
              child: Stack(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: CircleAvatar(
                      radius: 55.r,
                      backgroundColor: Colors.white,
                      child: CircleAvatar(
                        radius: 52.r,
                        backgroundColor: Color(0xFFF16621).withOpacity(0.1),
                        child: Icon(
                          Icons.person,
                          size: 55.sp,
                          color: const Color(0xFFF16621),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 5,
                    right: 5,
                    child: Container(
                      padding: EdgeInsets.all(8.w),
                      decoration: const BoxDecoration(
                        color: Color(0xFFF16621),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.edit, color: Colors.white, size: 16.sp),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 30.h),

            // Campos de texto usando los controladores
            _buildField("Nombre de Usuario", _usernameController),
            _buildField("Nombre", _nombreController),
            _buildField("Apellido", _apellidoController),
            _buildField("Correo Electrónico", _emailController),
            _buildField("Teléfono", _telefonoController),

            SizedBox(height: 30.h),

            // Botón Guardar
            SizedBox(
              width: double.infinity,
              height: 52.h,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF16621),
                  foregroundColor: Colors.white,
                  elevation: 4,
                  shadowColor: const Color(0xFFF16621).withOpacity(0.4),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.r),
                  ),
                ),
                onPressed: _guardarCambios,
                child: Text(
                  "Actualizar Información",
                  style: TextStyle(
                    fontSize: 16.sp,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget auxiliar para no repetir código de diseño
  Widget _buildField(String label, TextEditingController controller) {
    return Padding(
      padding: EdgeInsets.only(bottom: 20.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "  $label", // Un pequeño espacio para alinear con el borde
            style: TextStyle(
              fontSize: 12.sp,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade700,
            ),
          ),
          SizedBox(height: 6.h),
          TextFormField(
            controller: controller,
            style: TextStyle(fontSize: 14.sp),
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.grey.shade50,
              isDense: true,
              contentPadding: EdgeInsets.symmetric(
                horizontal: 16.w,
                vertical: 14.h,
              ),
              // Borde normal
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.r),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              // Borde cuando haces clic
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.r),
                borderSide: const BorderSide(
                  color: Color(0xFFF16621),
                  width: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
