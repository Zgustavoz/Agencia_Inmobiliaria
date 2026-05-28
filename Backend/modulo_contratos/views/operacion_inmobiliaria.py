from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from modulo_contratos.models.operacion_inmobiliaria import OperacionInmobiliaria
from modulo_contratos.serializers.reporte_operacion import ReporteOperacionSerializer
from shared.services.reportes_utils import filter_periodo, build_pdf_response


class OperacionInmobiliariaViewSet(viewsets.ModelViewSet):
    queryset = OperacionInmobiliaria.objects.all().order_by('-creado_en')
    serializer_class = ReporteOperacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        tenant_id = getattr(self.request, 'tenant_id', None)
        if tenant_id:
            queryset = queryset.filter(propiedad__tenant_id=tenant_id)
        return queryset

    @action(detail=False, methods=['get'])
    def reporte(self, request):
        queryset = self.get_queryset()

        estado = request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)

        tipo = request.query_params.get('tipo_operacion')
        if tipo:
            queryset = queryset.filter(tipo_operacion=tipo)

        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        queryset = filter_periodo(queryset, 'fecha_operacion', fecha_inicio, fecha_fin)

        serializer = ReporteOperacionSerializer(queryset, many=True)
        data = serializer.data

        if request.query_params.get('format') == 'pdf':
            headers = [
                'Codigo', 'Tipo', 'Fecha', 'Estado', 'Monto', 'Moneda', 'Cliente', 'Propiedad'
            ]
            rows = [
                [
                    item.get('codigo_operacion'),
                    item.get('tipo_operacion'),
                    item.get('fecha_operacion'),
                    item.get('estado'),
                    item.get('monto_operacion'),
                    item.get('moneda_codigo'),
                    item.get('cliente_nombre'),
                    item.get('propiedad_codigo'),
                ]
                for item in data
            ]
            return build_pdf_response(
                'Reporte de Operaciones',
                headers,
                rows,
                filename='reporte_operaciones.pdf'
            )

        return Response(data)
