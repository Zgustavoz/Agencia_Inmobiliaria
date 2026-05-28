from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from gestion_usuarios.permissions.superadmin import IsGlobalSuperAdmin
from shared.services.reportes_utils import filter_periodo, build_pdf_response

from modulo_inmuebles.models.propiedad import Propiedad
from modulo_clientes_seguimiento.models import Cliente
from modulo_contratos.models import Contrato
from modulo_contratos.models.operacion_inmobiliaria import OperacionInmobiliaria

from modulo_inmuebles.serializers.reporte_propiedad import ReportePropiedadSerializer
from modulo_clientes_seguimiento.serializers.reporte_cliente import ReporteClienteSerializer
from modulo_contratos.serializers.reporte_contrato import ReporteContratoSerializer
from modulo_contratos.serializers.reporte_operacion import ReporteOperacionSerializer


class ReportesGlobalesView(APIView):
    permission_classes = [IsAuthenticated, IsGlobalSuperAdmin]

    def get(self, request):
        tipo = request.query_params.get('tipo', '').strip().lower()
        if not tipo:
            return Response({'error': 'Parametro tipo es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        if tipo == 'propiedades':
            queryset = Propiedad.objects.all()
            estado = request.query_params.get('estado_propiedad')
            if estado:
                queryset = queryset.filter(estado_propiedad=estado)
            ciudad = request.query_params.get('ciudad')
            if ciudad:
                queryset = queryset.filter(zona__ciudad__icontains=ciudad)
            zona = request.query_params.get('zona')
            if zona:
                queryset = queryset.filter(zona__zona__icontains=zona)

            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            queryset = filter_periodo(queryset, 'creado_en', fecha_inicio, fecha_fin)

            serializer = ReportePropiedadSerializer(queryset, many=True)
            data = serializer.data

            if request.query_params.get('format') == 'pdf':
                headers = ['Codigo', 'Titulo', 'Estado', 'Precio', 'Zona', 'Ciudad', 'Creado']
                rows = [
                    [
                        item.get('codigo_propiedad'),
                        item.get('titulo'),
                        item.get('estado_propiedad'),
                        item.get('precio'),
                        item.get('zona_nombre'),
                        item.get('zona_ciudad'),
                        item.get('creado_en'),
                    ]
                    for item in data
                ]
                return build_pdf_response('Reporte Global de Propiedades', headers, rows, filename='reporte_global_propiedades.pdf')

            return Response(data)

        if tipo == 'clientes':
            queryset = Cliente.objects.all()
            estado = request.query_params.get('estado')
            if estado:
                queryset = queryset.filter(estado=estado)
            origen = request.query_params.get('origen')
            if origen:
                queryset = queryset.filter(origen=origen)

            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            queryset = filter_periodo(queryset, 'creado_en', fecha_inicio, fecha_fin)

            serializer = ReporteClienteSerializer(queryset, many=True)
            data = serializer.data

            if request.query_params.get('format') == 'pdf':
                headers = ['Codigo', 'Nombre', 'Email', 'Telefono', 'Estado', 'Origen', 'Creado']
                rows = [
                    [
                        item.get('codigo_cliente'),
                        item.get('nombre_completo'),
                        item.get('email'),
                        item.get('telefono'),
                        item.get('estado'),
                        item.get('origen'),
                        item.get('creado_en'),
                    ]
                    for item in data
                ]
                return build_pdf_response('Reporte Global de Clientes', headers, rows, filename='reporte_global_clientes.pdf')

            return Response(data)

        if tipo == 'contratos':
            queryset = Contrato.objects.all()
            estado = request.query_params.get('estado_contrato')
            if estado:
                queryset = queryset.filter(estado_contrato=estado)
            tipo_operacion = request.query_params.get('tipo_operacion')
            if tipo_operacion:
                queryset = queryset.filter(tipo_operacion=tipo_operacion)

            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            queryset = filter_periodo(queryset, 'fecha_inicio', fecha_inicio, fecha_fin)

            serializer = ReporteContratoSerializer(queryset, many=True)
            data = serializer.data

            if request.query_params.get('format') == 'pdf':
                headers = ['Codigo', 'Estado', 'Tipo', 'Inicio', 'Fin', 'Monto', 'Cliente', 'Propiedad']
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
                return build_pdf_response('Reporte Global de Contratos', headers, rows, filename='reporte_global_contratos.pdf')

            return Response(data)

        if tipo == 'operaciones':
            queryset = OperacionInmobiliaria.objects.all()
            estado = request.query_params.get('estado')
            if estado:
                queryset = queryset.filter(estado=estado)
            tipo_operacion = request.query_params.get('tipo_operacion')
            if tipo_operacion:
                queryset = queryset.filter(tipo_operacion=tipo_operacion)

            fecha_inicio = request.query_params.get('fecha_inicio')
            fecha_fin = request.query_params.get('fecha_fin')
            queryset = filter_periodo(queryset, 'fecha_operacion', fecha_inicio, fecha_fin)

            serializer = ReporteOperacionSerializer(queryset, many=True)
            data = serializer.data

            if request.query_params.get('format') == 'pdf':
                headers = ['Codigo', 'Tipo', 'Fecha', 'Estado', 'Monto', 'Moneda', 'Cliente', 'Propiedad']
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
                return build_pdf_response('Reporte Global de Operaciones', headers, rows, filename='reporte_global_operaciones.pdf')

            return Response(data)

        return Response({'error': 'Tipo de reporte no soportado'}, status=status.HTTP_400_BAD_REQUEST)
