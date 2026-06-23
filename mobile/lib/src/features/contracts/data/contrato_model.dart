class PagoContratoMobile {
  final int idPago;
  final String monto;
  final String fechaVencimiento;
  final String? fechaPago;
  final String estado;
  final String? observaciones;

  PagoContratoMobile({
    required this.idPago,
    required this.monto,
    required this.fechaVencimiento,
    required this.estado,
    this.fechaPago,
    this.observaciones,
  });

  factory PagoContratoMobile.fromJson(Map<String, dynamic> json) {
    return PagoContratoMobile(
      idPago: json['id_pago'] ?? 0,
      monto: '${json['monto'] ?? '0.00'}',
      fechaVencimiento: '${json['fecha_vencimiento'] ?? ''}',
      fechaPago: json['fecha_pago']?.toString(),
      estado: '${json['estado'] ?? 'PENDIENTE'}',
      observaciones: json['observaciones']?.toString(),
    );
  }
}

class ContratoMobile {
  final int idContrato;
  final String codigoContrato;
  final String propiedad;
  final String cliente;
  final String agente;
  final String monto;
  final String fechaInicio;
  final String? fechaFin;
  final String? condiciones;
  final String? observaciones;
  final String estadoContrato;
  final List<PagoContratoMobile> pagosPendientes;

  ContratoMobile({
    required this.idContrato,
    required this.codigoContrato,
    required this.propiedad,
    required this.cliente,
    required this.agente,
    required this.monto,
    required this.fechaInicio,
    required this.estadoContrato,
    required this.pagosPendientes,
    this.fechaFin,
    this.condiciones,
    this.observaciones,
  });

  PagoContratoMobile? get proximoPago {
    if (pagosPendientes.isEmpty) return null;
    return pagosPendientes.first;
  }

  factory ContratoMobile.fromCriteriosJson(Map<String, dynamic> json) {
    final contrato = (json['contrato'] as Map?)?.cast<String, dynamic>() ?? {};
    final pagosRaw = json['pagos'];
    final pagos = pagosRaw is List
        ? pagosRaw
            .whereType<Map>()
            .map((item) => PagoContratoMobile.fromJson(item.cast<String, dynamic>()))
            .where((pago) => pago.estado.toUpperCase() == 'PENDIENTE')
            .toList()
        : <PagoContratoMobile>[];

    pagos.sort((a, b) => a.fechaVencimiento.compareTo(b.fechaVencimiento));

    return ContratoMobile(
      idContrato: contrato['id_contrato'] ?? 0,
      codigoContrato: '${contrato['codigo_contrato'] ?? 'Contrato'}',
      propiedad: '${contrato['propiedad'] ?? 'Propiedad'}',
      cliente: '${contrato['cliente'] ?? 'Cliente'}',
      agente: '${contrato['agente'] ?? 'Agente'}',
      monto: '${contrato['monto'] ?? '0.00'}',
      fechaInicio: '${contrato['fecha_inicio'] ?? ''}',
      fechaFin: contrato['fecha_fin']?.toString(),
      condiciones: contrato['condiciones']?.toString(),
      observaciones: contrato['observaciones']?.toString(),
      estadoContrato: '${contrato['estado_contrato'] ?? 'ACTIVO'}',
      pagosPendientes: pagos,
    );
  }
}
