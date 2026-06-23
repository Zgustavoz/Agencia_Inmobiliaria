from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import FileResponse
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from modulo_contratos.models import DocumentoContrato
from ..utils.pdf_generator import generar_contrato_pdf

from modulo_contratos.models import Contrato
from modulo_contratos.serializers import ContratoSerializer
from modulo_contratos.serializers.reporte_contrato import ReporteContratoSerializer
from shared.services.reportes_utils import filter_periodo, build_pdf_response
from rest_framework.decorators import action
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
import urllib.request
from datetime import datetime

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all().order_by('-creado_en')
    serializer_class = ContratoSerializer
    permission_classes = [IsAuthenticated] #IsAutenticated

    search_fields = [
        'codigo_contrato',
        'cliente__nombres',
        'cliente__apellidos',
        'propiedad__codigo_propiedad'
    ]

    ordering_fields = [
        'fecha_inicio',
        'fecha_fin',
        'estado_contrato',
        'creado_en'
    ]

    filterset_fields = [
        'estado_contrato',
        'tipo_operacion'
    ]

    @action(detail=False, methods=['get'])
    def resumen(self, request):
        data = {
            'activos': Contrato.objects.filter(
                estado_contrato='ACTIVO'
            ).count(),

            'vencidos': Contrato.objects.filter(
                estado_contrato='VENCIDO'
            ).count(),

            'finalizados': Contrato.objects.filter(
                estado_contrato='FINALIZADO'
            ).count(),

            'borradores': Contrato.objects.filter(
                estado_contrato='BORRADOR'
            ).count()
        }

        return Response(data)
    
    @action(detail=True, methods=['get'])
    def exportar_pdf(self, request, pk=None):
        contrato = self.get_object()
        pdf = generar_contrato_pdf(contrato)

        nombre_archivo = f"contratos/contrato_{contrato.codigo_contrato}.pdf"

        ruta = default_storage.save(
            nombre_archivo,
            ContentFile(pdf.getvalue())
        )

        archivo_url = default_storage.url(ruta)

        DocumentoContrato.objects.create(
            contrato=contrato,
            nombre=f"Contrato {contrato.codigo_contrato}",
            archivo_url=archivo_url
        )

        pdf.seek(0)

        return FileResponse(
            pdf,
            as_attachment=True,
            filename=f"contrato_{contrato.codigo_contrato}.pdf"
        )

    @action(detail=False, methods=['get'])
    def reporte(self, request):
        queryset = self.get_queryset()

        estado = request.query_params.get('estado_contrato')
        if estado:
            queryset = queryset.filter(estado_contrato=estado)

        tipo = request.query_params.get('tipo_operacion')
        if tipo:
            queryset = queryset.filter(tipo_operacion=tipo)

        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        queryset = filter_periodo(queryset, 'fecha_inicio', fecha_inicio, fecha_fin)

        serializer = ReporteContratoSerializer(queryset, many=True)
        data = serializer.data

        if request.query_params.get('format') == 'pdf':
            headers = [
                'Codigo', 'Estado', 'Tipo', 'Inicio', 'Fin', 'Monto', 'Cliente', 'Propiedad'
            ]
            rows = [
                [
                    item.get('codigo_contrato'),
                    item.get('estado_contrato'),
                    item.get('tipo_operacion'),
                    item.get('fecha_inicio'),
                    item.get('fecha_fin'),
                    item.get('monto'),
                    item.get('cliente_nombre'),
                    item.get('propiedad_codigo'),
                ]
                for item in data
            ]
            return build_pdf_response(
                'Reporte de Contratos',
                headers,
                rows,
                filename='reporte_contratos.pdf'
            )

        return Response(data)
    