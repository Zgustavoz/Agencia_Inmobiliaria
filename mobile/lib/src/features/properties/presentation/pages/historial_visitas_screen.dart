import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';
import 'package:mobile/src/features/properties/logic/visita_provider.dart';
import 'package:mobile/src/features/properties/presentation/pages/visita_detalle_screen.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class HistorialVisitasScreen extends StatefulWidget {
  const HistorialVisitasScreen({super.key});

  @override
  State<HistorialVisitasScreen> createState() => _HistorialVisitasScreenState();
}

class _HistorialVisitasScreenState extends State<HistorialVisitasScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = context.read<UserProvider>().usuario;
      final token = context.read<UserProvider>().token;
      if (user != null && token != null) {
        context.read<VisitaProvider>().cargarMisVisitas(token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final visitaProvider = Provider.of<VisitaProvider>(context);

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text("Mis Citas y Visitas"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: visitaProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFF16621)))
          : visitaProvider.misVisitas.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: EdgeInsets.all(15.w),
                  itemCount: visitaProvider.misVisitas.length,
                  itemBuilder: (context, index) {
                    final visita = visitaProvider.misVisitas[index];
                    return InkWell(
                      onTap: () => Navigator.push(
                        context, 
                        MaterialPageRoute(builder: (_) => VisitaDetalleScreen(visita: visita))
                      ),
                      child: _buildVisitaCard(visita),
                    );
                  },
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.calendar_today_outlined, size: 80.sp, color: Colors.grey.shade300),
          SizedBox(height: 20.h),
          Text(
            "No tienes visitas programadas",
            style: TextStyle(fontSize: 16.sp, color: Colors.grey, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildVisitaCard(var visita) {
    Color statusColor;
    switch (visita.estado.toLowerCase()) {
      case 'confirmada': statusColor = Colors.green; break;
      case 'realizada': statusColor = Colors.blue; break;
      case 'cancelada': statusColor = Colors.red; break;
      default: statusColor = Colors.orange;
    }

    return Container(
      margin: EdgeInsets.only(bottom: 15.h),
      padding: EdgeInsets.all(15.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15.r),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 5))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10.r),
                ),
                child: Text(
                  visita.estado.toUpperCase(),
                  style: TextStyle(color: statusColor, fontSize: 10.sp, fontWeight: FontWeight.bold),
                ),
              ),
              Text(
                visita.fecha,
                style: TextStyle(color: Colors.grey, fontSize: 12.sp),
              ),
            ],
          ),
          SizedBox(height: 12.h),
          Text(
            visita.propiedadTitulo,
            style: TextStyle(fontSize: 15.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.h),
          Row(
            children: [
              Icon(Icons.access_time, size: 14.sp, color: Colors.grey),
              SizedBox(width: 5.w),
              Text(
                "${visita.horaInicio} - ${visita.horaFin}",
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13.sp),
              ),
            ],
          ),
          if (visita.comentarioAgente != null) ...[
            const Divider(height: 20),
            Text(
              "Nota del agente:",
              style: TextStyle(fontSize: 12.sp, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
            ),
            Text(
              visita.comentarioAgente!,
              style: TextStyle(fontSize: 12.sp, color: Colors.grey.shade600, fontStyle: FontStyle.italic),
            ),
          ],
        ],
      ),
    );
  }
}
