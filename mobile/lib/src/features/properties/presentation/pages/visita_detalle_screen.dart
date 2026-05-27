import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/src/features/properties/data/visita_model.dart';
import 'package:mobile/src/features/properties/data/visita_service.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';
import 'package:provider/provider.dart';

class VisitaDetalleScreen extends StatefulWidget {
  final Visita visita;

  const VisitaDetalleScreen({super.key, required this.visita});

  @override
  State<VisitaDetalleScreen> createState() => _VisitaDetalleScreenState();
}

class _VisitaDetalleScreenState extends State<VisitaDetalleScreen> {
  final TextEditingController _comentarioController = TextEditingController();
  int _calificacion = 0;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _comentarioController.text = widget.visita.comentarioCliente ?? "";
    _calificacion = widget.visita.calificacion ?? 0;
  }

  Future<void> _guardarFeedback() async {
    setState(() => _submitting = true);
    final token = context.read<UserProvider>().token;

    final success = await VisitaService.actualizarVisita(widget.visita.id, {
      "comentario_cliente": _comentarioController.text,
      "calificacion": _calificacion,
    }, token!);

    setState(() => _submitting = false);
    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Feedback guardado con éxito")),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Error al guardar feedback")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Detalle de Visita")),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.visita.propiedadTitulo,
              style: TextStyle(fontSize: 20.sp, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10.h),
            Text("Fecha: ${widget.visita.fecha} | ${widget.visita.horaInicio}"),
            SizedBox(height: 20.h),
            const Text("Tu comentario:"),
            TextField(
              controller: _comentarioController,
              maxLines: 3,
              decoration: const InputDecoration(border: OutlineInputBorder()),
            ),
            SizedBox(height: 20.h),
            const Text("Califica tu experiencia:"),
            Row(
              children: List.generate(
                5,
                (index) => IconButton(
                  icon: Icon(
                    index < _calificacion ? Icons.star : Icons.star_border,
                    color: Colors.amber,
                  ),
                  onPressed: () => setState(() => _calificacion = index + 1),
                ),
              ),
            ),
            SizedBox(height: 30.h),
            ElevatedButton(
              onPressed: _submitting ? null : _guardarFeedback,
              child: _submitting
                  ? const CircularProgressIndicator()
                  : const Text("Guardar Feedback"),
            ),
          ],
        ),
      ),
    );
  }
}
