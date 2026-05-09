from io import BytesIO
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas


def generar_contrato_pdf(contrato):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(180, 760, "CONTRATO INMOBILIARIO")

    pdf.setFont("Helvetica", 12)

    y = 720

    lineas = [
        f"Código: {contrato.codigo_contrato}",
        f"Cliente: {contrato.cliente.nombres} {contrato.cliente.apellidos}",
        f"Agente: {contrato.agente.nombres} {contrato.agente.apellidos}",
        f"Propiedad: {contrato.propiedad.codigo_propiedad}",
        f"Monto: Bs. {contrato.monto}",
        f"Garantía: Bs. {contrato.garantia}",
        f"Comisión: Bs. {contrato.comision}",
        f"Inicio: {contrato.fecha_inicio}",
        f"Fin: {contrato.fecha_fin}",
        "",
        "CONDICIONES:",
        contrato.condiciones or "",
        "",
        "OBSERVACIONES:",
        contrato.observaciones or "",
    ]

    for linea in lineas:
        pdf.drawString(70, y, str(linea))
        y -= 25

    pdf.drawString(70, 100, "Firma Cliente: ____________________")
    pdf.drawString(320, 100, "Firma Agente: ____________________")

    pdf.save()
    buffer.seek(0)

    return buffer