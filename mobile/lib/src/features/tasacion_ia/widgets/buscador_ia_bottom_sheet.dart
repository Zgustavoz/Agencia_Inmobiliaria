// buscador_ia_bottom_sheet.dart
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';
import '../../auth/logic/user_provider.dart';
import '../data/busqueda_service.dart';

class BuscadorIABottomSheet extends StatefulWidget {
  const BuscadorIABottomSheet({super.key});

  @override
  State<BuscadorIABottomSheet> createState() => _BuscadorIABottomSheetState();
}

class _BuscadorIABottomSheetState extends State<BuscadorIABottomSheet> {
  final List<Map<String, dynamic>> _mensajes = [];
  final TextEditingController _controller = TextEditingController();
  final BusquedaIAService _service = BusquedaIAService();

  bool _isLoading = false;

  // Controladores de Audio
  final AudioRecorder _audioRecorder = AudioRecorder();
  bool _isRecording = false;

  @override
  void dispose() {
    _audioRecorder.dispose();
    _controller.dispose();
    super.dispose();
  }

  // --- 1. ENVIAR TEXTO ---
  void _enviarMensaje() async {
    final String textoAEnviar = _controller.text;
    if (textoAEnviar.isEmpty) return;

    final token = Provider.of<UserProvider>(context, listen: false).token;

    setState(() {
      _mensajes.add({"role": "user", "text": textoAEnviar});
      _isLoading = true;
      _controller.clear();
    });

    try {
      final res = await _service.enviarBusqueda(
        token: token ?? "",
        texto: textoAEnviar,
      );
      _procesarRespuestaBackend(res);
    } catch (e) {
      _mostrarError("Error: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // --- 2. CONTROL DEL MICRÓFONO ---
  void _toggleRecording() async {
    try {
      if (_isRecording) {
        // Detener la grabación
        final path = await _audioRecorder.stop();
        setState(() => _isRecording = false);

        if (path != null) {
          _enviarAudioAlBackend(path);
        }
      } else {
        // Iniciar la grabación si hay permisos
        if (await _audioRecorder.hasPermission()) {
          final dir = await getApplicationDocumentsDirectory();
          final String filePath =
              '${dir.path}/audio_busqueda_${DateTime.now().millisecondsSinceEpoch}.m4a';

          await _audioRecorder.start(
            const RecordConfig(encoder: AudioEncoder.aacLc),
            path: filePath,
          );

          setState(() => _isRecording = true);
        } else {
          _mostrarError("Permiso de micrófono denegado.");
        }
      }
    } catch (e) {
      _mostrarError("Error con el micrófono: $e");
    }
  }

  // --- 3. ENVIAR AUDIO AL BACKEND ---
  void _enviarAudioAlBackend(String path) async {
    final token = Provider.of<UserProvider>(context, listen: false).token;

    setState(() {
      _mensajes.add({"role": "user", "text": "🎤 Audio de voz enviado..."});
      _isLoading = true;
    });

    try {
      final res = await _service.enviarBusqueda(
        token: token ?? "",
        audioPath: path,
      );
      _procesarRespuestaBackend(res);
    } catch (e) {
      _mostrarError("Error al procesar audio: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // --- 4. PROCESAR RESPUESTA COMÚN ---
  void _procesarRespuestaBackend(Map<String, dynamic> res) {
    setState(() {
      final filtros = res['ia_entendio'] ?? {};
      final ubicacion = filtros['ubicacion'] ?? 'la zona indicada';
      final tipo = filtros['tipo_propiedad'] ?? 'inmueble';
      final total = res['resultados_count'] ?? 0;

      _mensajes.add({
        "role": "ia",
        "text":
            "Entendido. Busqué un(a) $tipo en $ubicacion. Encontré $total propiedades coincidentes.",
        "resultados": res['resultados'] ?? [],
      });
    });
  }

  void _mostrarError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
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
          if (_isLoading) const LinearProgressIndicator(color: Colors.blue),
          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 15.h),
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.r)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.search_rounded, color: Colors.white, size: 24.sp),
              SizedBox(width: 10.w),
              Text(
                "Buscador Inteligente",
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
          "Dime, ¿qué tipo de casa buscas y por qué zona?",
          style: TextStyle(color: Colors.grey, fontSize: 14.sp),
        ),
      );
    }
    return ListView.builder(
      padding: EdgeInsets.all(20.w),
      itemCount: _mensajes.length,
      itemBuilder: (context, index) {
        final msg = _mensajes[index];
        final bool isUser = msg['role'] == 'user';
        final List<dynamic> propiedades = msg['resultados'] ?? [];

        return Column(
          crossAxisAlignment: isUser
              ? CrossAxisAlignment.end
              : CrossAxisAlignment.start,
          children: [
            Align(
              alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                margin: EdgeInsets.only(bottom: 8.h),
                padding: EdgeInsets.all(12.w),
                decoration: BoxDecoration(
                  color: isUser
                      ? Colors.blue.withOpacity(0.1)
                      : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(15.r),
                ),
                child: Text(
                  msg['text'] ?? "",
                  style: TextStyle(fontSize: 14.sp, color: Colors.black87),
                ),
              ),
            ),
            if (!isUser && propiedades.isNotEmpty)
              Container(
                height: 140.h,
                margin: EdgeInsets.only(bottom: 15.h),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: propiedades.length,
                  itemBuilder: (context, pIndex) {
                    return _buildTarjetaPropiedad(propiedades[pIndex]);
                  },
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildTarjetaPropiedad(Map<String, dynamic> propiedad) {
    return Container(
      width: 240.w,
      margin: EdgeInsets.only(right: 12.w, top: 4.h, bottom: 4.h),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(10.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              propiedad['titulo'] ?? 'Sin título',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.sp),
            ),
            SizedBox(height: 4.h),
            Row(
              children: [
                Icon(Icons.location_on, size: 12.sp, color: Colors.grey),
                SizedBox(width: 4.w),
                Text(
                  propiedad['nombre_zona'] ?? 'Zona norte',
                  style: TextStyle(color: Colors.grey, fontSize: 11.sp),
                ),
              ],
            ),
            const Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${propiedad['nombre_moneda'] == 'Dólares' ? '\$' : 'Bs.'} ${propiedad['precio']}",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                    fontSize: 13.sp,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(4.r),
                  ),
                  child: Text(
                    propiedad['modalidad_operacion'] ?? '',
                    style: TextStyle(
                      fontSize: 10.sp,
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // BOTÓN DE MICRÓFONO
            GestureDetector(
              onTap: _toggleRecording,
              child: CircleAvatar(
                backgroundColor: _isRecording
                    ? Colors.red
                    : Colors.blue.shade50,
                child: Icon(
                  _isRecording ? Icons.stop : Icons.mic,
                  color: _isRecording ? Colors.white : Colors.blue,
                  size: 22.sp,
                ),
              ),
            ),
            SizedBox(width: 8.w),

            Expanded(
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 15.w),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(25.r),
                ),
                child: TextField(
                  controller: _controller,
                  enabled: !_isRecording, // Deshabilita mientras graba
                  decoration: InputDecoration(
                    hintText: _isRecording
                        ? "Escuchando... presiona para enviar"
                        : "Ej. Busco una casa por Equipetrol...",
                    border: InputBorder.none,
                    hintStyle: TextStyle(
                      color: _isRecording ? Colors.red.shade400 : Colors.grey,
                    ),
                  ),
                  onSubmitted: (_) => _enviarMensaje(),
                ),
              ),
            ),
            SizedBox(width: 5.w),

            // BOTÓN DE ENVIAR (Se oculta al grabar)
            if (!_isRecording)
              CircleAvatar(
                backgroundColor: Colors.blue,
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
