import 'package:flutter/material.dart';
import 'package:mobile/src/features/properties/data/visita_model.dart';
import 'package:mobile/src/features/properties/data/visita_service.dart';

class VisitaProvider with ChangeNotifier {
  List<Visita> _misVisitas = [];
  bool _isLoading = false;

  List<Visita> get misVisitas => _misVisitas;
  bool get isLoading => _isLoading;

  Future<void> cargarMisVisitas(String token) async {
    _isLoading = true;
    notifyListeners();
    _misVisitas = await VisitaService.getMisVisitas(token);
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> solicitarVisita({
    required int clienteId,
    required int propiedadId,
    required String fecha,
    required String hora,
    required String comentario,
    required String token,
  }) async {
    _isLoading = true;
    notifyListeners();
    final success = await VisitaService.solicitarVisita(
      clienteId: clienteId,
      propiedadId: propiedadId,
      fecha: fecha,
      hora: hora,
      comentario: comentario,
      token: token,
    );
    _isLoading = false;
    notifyListeners();
    return success;
  }
}
