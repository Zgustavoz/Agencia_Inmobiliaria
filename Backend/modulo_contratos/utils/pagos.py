from datetime import date
from dateutil.relativedelta import relativedelta
from modulo_contratos.models import PagoContrato


def generar_pagos_contrato_alquiler(contrato):
    """
    Genera pagos mensuales para contratos de alquiler
    """

    if contrato.tipo_operacion != "ALQUILER":
        return []

    if not contrato.fecha_inicio or not contrato.fecha_fin:
        return []

    # evitar duplicados
    if contrato.pagos.exists():
        return []

    pagos = []

    fecha_actual = contrato.fecha_inicio

    while fecha_actual < contrato.fecha_fin:
        pago = PagoContrato.objects.create(
            contrato=contrato,
            monto=contrato.monto,  # o prorrateado si quieres
            fecha_vencimiento=fecha_actual,
            estado="PENDIENTE"
        )

        pagos.append(pago)

        fecha_actual += relativedelta(months=1)

    return pagos