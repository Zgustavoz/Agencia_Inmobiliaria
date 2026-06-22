import 'package:flutter/material.dart';
import 'package:mobile/src/features/contracts/data/contrato_model.dart';
import 'package:mobile/src/features/contracts/data/contrato_service.dart';

class ContratoProvider with ChangeNotifier {
  List<ContratoMobile> _misContratosPendientes = [];
  bool _isLoading = false;
  bool _isPaying = false;
  int? _pagoEnProcesoId;
  String? _error;

  List<ContratoMobile> get misContratosPendientes => _misContratosPendientes;
  bool get isLoading => _isLoading;
  bool get isPaying => _isPaying;
  int? get pagoEnProcesoId => _pagoEnProcesoId;
  String? get error => _error;

  Future<void> cargarMisContratosPendientes({
    required int userId,
    required String token,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _misContratosPendientes =
          await ContratoService.getMisContratosPendientes(
        userId: userId,
        token: token,
      );
    } catch (e) {
      _error = e.toString();
      _misContratosPendientes = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> crearCheckoutPagoContrato({
    required int idPago,
    required String token,
  }) async {
    _isPaying = true;
    _pagoEnProcesoId = idPago;
    _error = null;
    notifyListeners();

    try {
      return await ContratoService.crearCheckoutPagoContrato(
        idPago: idPago,
        token: token,
      );
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      return null;
    } finally {
      _isPaying = false;
      _pagoEnProcesoId = null;
      notifyListeners();
    }
  }

  Future<bool> confirmarPagoContrato({
    required int idPago,
    required String token,
  }) async {
    try {
      return await ContratoService.confirmarPagoContrato(
        idPago: idPago,
        token: token,
      );
    } catch (e) {
      _error = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
      return false;
    }
  }
}
