class HorarioDisponibilidad {
  final int id;
  final int diaSemana; // 0=Lunes, 6=Domingo
  final String horaInicio;
  final String horaFin;

  HorarioDisponibilidad({
    required this.id,
    required this.diaSemana,
    required this.horaInicio,
    required this.horaFin,
  });

  factory HorarioDisponibilidad.fromJson(Map<String, dynamic> json) {
    return HorarioDisponibilidad(
      id: json['id_horario'] ?? 0,
      diaSemana: int.tryParse(json['dia_semana'].toString()) ?? 0,
      horaInicio: json['hora_inicio'] ?? '',
      horaFin: json['hora_fin'] ?? '',
    );
  }

  String get nombreDia {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return (diaSemana >= 0 && diaSemana < 7) ? dias[diaSemana] : 'Desconocido';
  }
}
