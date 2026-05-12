import 'package:mobile/src/features/properties/data/propiedad_model.dart';

class Visita {
  final int id;
  final int propiedadId;
  final String propiedadTitulo;
  final String fecha;
  final String horaInicio;
  final String horaFin;
  final String estado;
  final String? comentarioCliente;
  final String? comentarioAgente;
  final int? calificacion;

  Visita({
    required this.id,
    required this.propiedadId,
    required this.propiedadTitulo,
    required this.fecha,
    required this.horaInicio,
    required this.horaFin,
    required this.estado,
    this.comentarioCliente,
    this.comentarioAgente,
    this.calificacion,
  });

  factory Visita.fromJson(Map<String, dynamic> json) {
    return Visita(
      id: json['id_visita'] ?? 0,
      propiedadId: json['propiedad'] ?? 0,
      propiedadTitulo: json['propiedad_titulo'] ?? 'Propiedad',
      fecha: json['fecha_visita'] ?? '',
      horaInicio: json['hora_inicio'] ?? '',
      horaFin: json['hora_fin'] ?? '',
      estado: json['estado'] ?? 'pendiente',
      comentarioCliente: json['comentario_cliente'],
      comentarioAgente: json['comentario_agente'],
      calificacion: json['calificacion'],
    );
  }
}
