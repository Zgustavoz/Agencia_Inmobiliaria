from datetime import datetime
from io import BytesIO

from django.http import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def parse_date(value):
	if not value:
		return None
	for fmt in ("%Y-%m-%d", "%Y/%m/%d"):
		try:
			return datetime.strptime(value, fmt).date()
		except ValueError:
			continue
	return None


def filter_periodo(qs, field_name, fecha_inicio, fecha_fin):
	"""Filtra un queryset por un rango de fechas (inclusive)."""
	inicio = parse_date(fecha_inicio)
	fin = parse_date(fecha_fin)
	if inicio and fin:
		return qs.filter(**{f"{field_name}__range": (inicio, fin)})
	if inicio:
		return qs.filter(**{f"{field_name}__gte": inicio})
	if fin:
		return qs.filter(**{f"{field_name}__lte": fin})
	return qs


def build_pdf_response(title, headers, rows, filename="reporte.pdf"):
	buffer = BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=letter)
	width, height = letter

	y = height - 50
	pdf.setFont("Helvetica-Bold", 14)
	pdf.drawString(40, y, title)
	y -= 25

	pdf.setFont("Helvetica-Bold", 9)
	pdf.drawString(40, y, " | ".join(headers))
	y -= 18

	pdf.setFont("Helvetica", 9)
	for row in rows:
		line = " | ".join([str(col) if col is not None else "" for col in row])
		pdf.drawString(40, y, line[:120])
		y -= 14
		if y < 50:
			pdf.showPage()
			y = height - 50
			pdf.setFont("Helvetica", 9)

	pdf.save()
	buffer.seek(0)
	return FileResponse(buffer, as_attachment=True, filename=filename)

