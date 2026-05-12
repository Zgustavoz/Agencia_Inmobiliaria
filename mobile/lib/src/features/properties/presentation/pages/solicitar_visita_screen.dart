import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';
import 'package:mobile/src/features/properties/data/horario_model.dart';
import 'package:mobile/src/features/properties/data/visita_model.dart';
import 'package:mobile/src/features/properties/data/visita_service.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/features/auth/logic/user_provider.dart';
import 'package:mobile/src/features/properties/logic/visita_provider.dart';

class SolicitarVisitaScreen extends StatefulWidget {
  final Propiedad propiedad;

  const SolicitarVisitaScreen({super.key, required this.propiedad});

  @override
  State<SolicitarVisitaScreen> createState() => _SolicitarVisitaScreenState();
}

class _SolicitarVisitaScreenState extends State<SolicitarVisitaScreen> {
  DateTime? _fechaSeleccionada;
  HorarioDisponibilidad? _horarioSeleccionado;
  List<HorarioDisponibilidad> _horariosDisponibles = [];
  List<Visita> _visitasExistentes = [];
  bool _isLoadingHorarios = false;
  final TextEditingController _comentarioController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _cargarHorariosBase();
  }

  Future<void> _cargarHorariosBase() async {
    final token = context.read<UserProvider>().token;
    if (token == null) return;
    
    setState(() => _isLoadingHorarios = true);
    final horarios = await VisitaService.getHorariosPropiedad(widget.propiedad.id, token);
    setState(() {
      _horariosDisponibles = horarios;
      _isLoadingHorarios = false;
    });
  }

  Future<void> _seleccionarFecha(BuildContext context) async {
    // Obtenemos los días que tienen al menos un horario configurado
    if (_horariosDisponibles.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Esta propiedad no tiene horarios de visita configurados."))
      );
      return;
    }

    final diasDisponibles = _horariosDisponibles.map((h) => h.diaSemana).toSet();

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      locale: const Locale('es', 'BO'),
      selectableDayPredicate: (DateTime day) {
        // weekday en Flutter: 1=Lunes, 7=Domingo
        // diaSemana en Django: 0=Lunes, 6=Domingo
        int diaDjango = day.weekday - 1;
        return diasDisponibles.contains(diaDjango);
      },
    );
    
    if (picked != null) {
      final token = context.read<UserProvider>().token!;
      setState(() {
        _fechaSeleccionada = picked;
        _horarioSeleccionado = null; // Reset al cambiar fecha
        _isLoadingHorarios = true;
      });

      // Consultar visitas ya agendadas para esa fecha
      final fechaStr = DateFormat('yyyy-MM-dd').format(picked);
      final visitas = await VisitaService.getVisitasPropiedadFecha(widget.propiedad.id, fechaStr, token);
      
      setState(() {
        _visitasExistentes = visitas;
        _isLoadingHorarios = false;
      });
    }
  }

  bool _isHorarioOcupado(HorarioDisponibilidad horario) {
    return _visitasExistentes.any((v) => 
      v.horaInicio.substring(0, 5) == horario.horaInicio.substring(0, 5) &&
      v.estado.toLowerCase() != 'cancelada'
    );
  }

  List<HorarioDisponibilidad> _getHorariosParaDia(int diaSemana) {
    return _horariosDisponibles.where((h) => h.diaSemana == diaSemana).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Agendar Visita"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPropiedadInfo(),
            SizedBox(height: 30.h),
            Text(
              "1. Selecciona una fecha",
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 15.h),
            _buildSelector(
              icon: Icons.calendar_today,
              label: _fechaSeleccionada == null 
                  ? "Elegir Fecha" 
                  : DateFormat('EEEE d ' 'de MMMM', 'es_BO').format(_fechaSeleccionada!),
              onTap: () => _seleccionarFecha(context),
            ),
            
            if (_fechaSeleccionada != null) ...[
              SizedBox(height: 30.h),
              Text(
                "2. Horarios disponibles para este día",
                style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 15.h),
              _isLoadingHorarios 
                ? const Center(child: CircularProgressIndicator())
                : _buildHorariosGrid(),
            ],

            SizedBox(height: 30.h),
            Text(
              "3. Comentarios adicionales",
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10.h),
            TextField(
              controller: _comentarioController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: "Ej: Quiero ver el patio trasero...",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
                filled: true,
                fillColor: Colors.grey.shade50,
              ),
            ),
            SizedBox(height: 40.h),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildHorariosGrid() {
    // Ajustar dia_semana de Flutter (1=Lunes, 7=Domingo) a Django (0=Lunes, 6=Domingo)
    int diaDjango = _fechaSeleccionada!.weekday - 1;
    final horariosDia = _getHorariosParaDia(diaDjango);

    if (horariosDia.isEmpty) {
      return Text(
        "No hay horarios configurados para este día de la semana.",
        style: TextStyle(color: Colors.red.shade400, fontSize: 13.sp),
      );
    }

    return Wrap(
      spacing: 10.w,
      runSpacing: 10.h,
      children: horariosDia.map((h) {
        bool ocupado = _isHorarioOcupado(h);
        bool seleccionado = _horarioSeleccionado?.id == h.id;

        return InkWell(
          onTap: ocupado ? null : () => setState(() => _horarioSeleccionado = h),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 10.h),
            decoration: BoxDecoration(
              color: seleccionado ? const Color(0xFFF16621) : (ocupado ? Colors.grey.shade200 : Colors.white),
              border: Border.all(color: seleccionado ? const Color(0xFFF16621) : Colors.grey.shade300),
              borderRadius: BorderRadius.circular(10.r),
            ),
            child: Text(
              h.horaInicio.substring(0, 5),
              style: TextStyle(
                color: seleccionado ? Colors.white : (ocupado ? Colors.grey : Colors.black),
                fontWeight: seleccionado ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPropiedadInfo() {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(15.r),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10.r),
            child: Image.network(
              widget.propiedad.primeraImagen,
              width: 60.w,
              height: 60.w,
              fit: BoxFit.cover,
            ),
          ),
          SizedBox(width: 15.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.propiedad.titulo, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.sp), maxLines: 1),
                Text(widget.propiedad.zona, style: TextStyle(color: Colors.grey, fontSize: 11.sp)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSelector({required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 15.w, vertical: 12.h),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12.r),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFF16621), size: 20.sp),
            SizedBox(width: 12.w),
            Text(label, style: TextStyle(fontSize: 14.sp)),
            const Spacer(),
            const Icon(Icons.arrow_drop_down, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    final canSubmit = _fechaSeleccionada != null && _horarioSeleccionado != null;
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFFF16621),
        minimumSize: Size(double.infinity, 50.h),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.r)),
      ),
      onPressed: canSubmit ? _enviarSolicitud : null,
      child: const Text("CONFIRMAR VISITA", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
    );
  }

  void _enviarSolicitud() async {
    final userProvider = context.read<UserProvider>();
    final success = await context.read<VisitaProvider>().solicitarVisita(
      clienteId: userProvider.usuario!.id,
      propiedadId: widget.propiedad.id,
      fecha: DateFormat('yyyy-MM-dd').format(_fechaSeleccionada!),
      hora: _horarioSeleccionado!.horaInicio,
      comentario: _comentarioController.text,
      token: userProvider.token!,
    );

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("¡Visita agendada con éxito!")));
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Error al agendar. El horario podría haberse ocupado.")));
      }
    }
  }
}
