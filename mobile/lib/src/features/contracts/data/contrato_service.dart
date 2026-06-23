import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile/src/core/config/app_config.dart';
import 'package:mobile/src/features/contracts/data/contrato_model.dart';

class ContratoService {
  static String get contratosUrl => "${AppConfig.apiUrl}/api/contratos/";
  static String criteriosUrl(int idContrato) =>
      "${AppConfig.apiUrl}/api/pagos/contratos/$idContrato/criterios/";
  static String checkoutPagoUrl(int idPago) =>
      "${AppConfig.apiUrl}/api/pagos/contratos/$idPago/checkout/";
  static String confirmarPagoUrl(int idPago) =>
      "${AppConfig.apiUrl}/api/pagos/contratos/$idPago/confirmar/";

  static Future<List<ContratoMobile>> getMisContratosPendientes({
    required int userId,
    required String token,
  }) async {
    final contratosActivos = await _getContratosActivos(token);
    final misContratos = contratosActivos.where((contrato) {
      return _extraerIdCliente(contrato['cliente']) == userId;
    }).toList();

    final contratosPendientes = <ContratoMobile>[];

    for (final contrato in misContratos) {
      final idContrato = contrato['id_contrato'];
      if (idContrato == null) continue;

      final detalle = await _getCriteriosContrato(idContrato, token);
      if (detalle == null) continue;

      final contratoMobile = ContratoMobile.fromCriteriosJson(detalle);
      if (contratoMobile.pagosPendientes.isNotEmpty) {
        contratosPendientes.add(contratoMobile);
      }
    }

    return contratosPendientes;
  }

  static Future<List<Map<String, dynamic>>> _getContratosActivos(
    String token,
  ) async {
    try {
      final response = await http.get(
        Uri.parse("${contratosUrl}?estado_contrato=ACTIVO"),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        final List<dynamic> results = data is Map && data.containsKey('results')
            ? data['results']
            : data is List
                ? data
                : [];

        return results
            .whereType<Map>()
            .map((item) => item.cast<String, dynamic>())
            .toList();
      }
    } catch (e) {
      print("Error obteniendo contratos activos: $e");
    }

    return [];
  }

  static Future<Map<String, dynamic>?> _getCriteriosContrato(
    int idContrato,
    String token,
  ) async {
    try {
      final response = await http.get(
        Uri.parse(criteriosUrl(idContrato)),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        final dynamic data = jsonDecode(utf8.decode(response.bodyBytes));
        if (data is Map) return data.cast<String, dynamic>();
      }
    } catch (e) {
      print("Error obteniendo criterios del contrato $idContrato: $e");
    }

    return null;
  }

  static Future<String> crearCheckoutPagoContrato({
    required int idPago,
    required String token,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(checkoutPagoUrl(idPago)),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      final dynamic data = response.body.isNotEmpty
          ? jsonDecode(utf8.decode(response.bodyBytes))
          : null;

      if (response.statusCode == 200 && data is Map && data['url'] != null) {
        return data['url'].toString();
      }

      if (response.statusCode == 400) {
        throw Exception("Este pago ya fue realizado o no esta pendiente.");
      }

      final error = data is Map && data['error'] != null
          ? data['error'].toString()
          : "No se pudo preparar el pago.";
      throw Exception(error);
    } catch (e) {
      print("Error creando checkout de contrato: $e");
      rethrow;
    }
  }

  static Future<bool> confirmarPagoContrato({
    required int idPago,
    required String token,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(confirmarPagoUrl(idPago)),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode == 200) {
        final dynamic data = response.body.isNotEmpty
            ? jsonDecode(utf8.decode(response.bodyBytes))
            : null;
        return data is Map && data['estado'] == 'PAGADO';
      }
    } catch (e) {
      print("Error confirmando pago de contrato: $e");
    }

    return false;
  }

  static int? _extraerIdCliente(dynamic cliente) {
    if (cliente is int) return cliente;
    if (cliente is String) return int.tryParse(cliente);
    if (cliente is Map) {
      final id = cliente['id'] ?? cliente['id_usuario'] ?? cliente['pk'];
      if (id is int) return id;
      if (id is String) return int.tryParse(id);
    }
    return null;
  }
}
