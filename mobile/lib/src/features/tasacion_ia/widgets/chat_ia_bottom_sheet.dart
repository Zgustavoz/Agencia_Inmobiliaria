import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import '../../auth/logic/user_provider.dart';
import '../data/tasacion_service.dart';
import 'package:image_picker/image_picker.dart';

class ChatIABottomSheet extends StatefulWidget {
  const ChatIABottomSheet({super.key});

  @override
  State<ChatIABottomSheet> createState() => _ChatIABottomSheetState();
}

class _ChatIABottomSheetState extends State<ChatIABottomSheet> {
  final List<Map<String, dynamic>> _mensajes = [];
  final TextEditingController _controller = TextEditingController();
  final TasacionIAService _service = TasacionIAService();
  bool _isLoading = false;
  File? _imageSelected;

  void _enviarMensaje() async {
    // 1. Extraer los datos a variables locales inmediatamente
    final String textoAEnviar = _controller.text;
    final File? imagenAEnviar = _imageSelected;

    if (textoAEnviar.isEmpty && imagenAEnviar == null) return;

    final token = Provider.of<UserProvider>(context, listen: false).token;

    setState(() {
      _mensajes.add({
        "role": "user",
        "text": textoAEnviar, // Usar variable local
        "image": imagenAEnviar, // Usar variable local
      });
      _isLoading = true;

      // Ahora sí puedes limpiar la UI con seguridad
      _controller.clear();
      _imageSelected = null;
    });

    try {
      // 2. Pasar las variables locales al servicio (que mantienen los datos originales)
      final res = await _service.enviarConsulta(
        token: token ?? "",
        texto: textoAEnviar, // Variable local
        imagen: imagenAEnviar, // Variable local
      );

      setState(() {
        _mensajes.add({
          "role": "ia",
          "text": res['respuesta_ia'],
          "precio": res['precio_estimado'],
        });
      });
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _seleccionarImagen() async {
    try {
      final ImagePicker picker = ImagePicker(); // Instancia
      // Usamos ImageSource.gallery para abrir la galería
      final XFile? pickedFile = await picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85, // Recomendado para no saturar tu Cloudinary
      );

      if (pickedFile != null) {
        setState(() {
          _imageSelected = File(pickedFile.path);
        });
      }
    } catch (e) {
      print("Error al capturar imagen: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.r)),
      ),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(child: _buildListadoMensajes()),
          if (_isLoading)
            const LinearProgressIndicator(color: Color(0xFFF16621)),

          // NUEVO: Mostrar la imagen seleccionada antes de enviarla
          if (_imageSelected != null) _buildImagePreview(),

          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildImagePreview() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 10.h),
      alignment: Alignment.centerLeft,
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10.r),
            child: Image.file(
              _imageSelected!,
              height: 80.h,
              width: 80.h,
              fit: BoxFit.cover,
            ),
          ),
          Positioned(
            top: -10,
            right: -10,
            child: IconButton(
              icon: const Icon(Icons.cancel, color: Colors.redAccent),
              onPressed: () {
                setState(() {
                  _imageSelected = null;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 15.h),
      decoration: BoxDecoration(
        color: const Color(0xFFF16621), // Tu color naranja corporativo
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.r)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome, color: Colors.white, size: 24.sp),
              SizedBox(width: 10.w),
              Text(
                "Tasador IA Multimodal",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildListadoMensajes() {
    if (_mensajes.isEmpty) {
      return Center(
        child: Text(
          "¡Hola! Describe tu propiedad para tasarla.",
          style: TextStyle(color: Colors.grey, fontSize: 14.sp),
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(20.w),
      itemCount: _mensajes.length,
      itemBuilder: (context, index) {
        final msg = _mensajes[index];
        return msg['role'] == 'ia'
            ? _buildMensajeIA(msg)
            : _buildMensajeUsuario(msg);
      },
    );
  }

  Widget _buildMensajeUsuario(Map<String, dynamic> msg) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        margin: EdgeInsets.only(bottom: 15.h, left: 40.w),
        padding: EdgeInsets.all(12.w),
        decoration: BoxDecoration(
          color: const Color(0xFFF16621).withOpacity(0.1),
          borderRadius: BorderRadius.circular(15.r),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            // Si el mensaje tiene imagen, la mostramos
            if (msg['image'] != null) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(10.r),
                child: Image.file(
                  msg['image'],
                  height: 120.h,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(height: 5.h),
            ],
            // Si hay texto, lo mostramos
            if (msg['text'] != null && msg['text'].toString().isNotEmpty)
              Text(msg['text']),
          ],
        ),
      ),
    );
  }

  Widget _buildMensajeIA(Map<String, dynamic> msg) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: EdgeInsets.only(bottom: 15.h, right: 40.w),
            padding: EdgeInsets.all(15.w),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(15.r),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(msg['text'] ?? ""),
                if (msg['precio'] != null) ...[
                  Divider(),
                  Text(
                    "Precio Estimado: \$${msg['precio']}",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              icon: Icon(Icons.camera_alt_outlined, color: Color(0xFFF16621)),
              onPressed: _seleccionarImagen, // Vinculamos el método
            ),
            Expanded(
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 15.w),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(25.r),
                ),
                child: TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: "Escribe o adjunta una foto...",
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
            SizedBox(width: 5.w),
            CircleAvatar(
              backgroundColor: const Color(0xFFF16621),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white, size: 20),
                onPressed: _enviarMensaje,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
