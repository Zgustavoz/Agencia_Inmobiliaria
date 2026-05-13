import 'package:flutter/material.dart';
import 'package:mobile/src/features/properties/data/propiedad_model.dart';
import 'package:mobile/src/features/properties/data/propiedad_service.dart';

class PropiedadProvider with ChangeNotifier {
  List<Propiedad> _destacadas = [];
  bool _isLoading = false;
  String? _error;

  List<Propiedad> get destacadas => _destacadas;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> cargarDestacadas() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _destacadas = await PropiedadService.getPropiedadesDestacadas();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
