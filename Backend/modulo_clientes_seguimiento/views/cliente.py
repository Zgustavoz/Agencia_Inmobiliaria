# pylint: disable=C0114,C0115,C0116,no-member,W0613
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from ..models import Cliente, ClienteInteraccion, ClienteOportunidad, ClienteRecordatorio, ClienteAgente
from ..serializers import (
    ClienteSerializer, ClienteListSerializer,
    ClienteInteraccionSerializer, ClienteOportunidadSerializer,
    ClienteRecordatorioSerializer, ClienteAgenteSerializer,
)
from ..serializers.reporte_cliente import ReporteClienteSerializer
from shared.services.reportes_utils import filter_periodo, build_pdf_response
from rest_framework.permissions import IsAuthenticated
from gestion_usuarios.views.base import TenantAwareViewSet

class ClientePagination(PageNumberPagination):
    page_size             = 10
    page_size_query_param = 'page_size'
    max_page_size         = 50

class ClienteViewSet(TenantAwareViewSet):
    queryset           = Cliente.objects.all().order_by('-creado_en')
    permission_classes = [IsAuthenticated]
    pagination_class   = ClientePagination

    def get_serializer_class(self):
        if self.action == 'list':
            return ClienteListSerializer
        return ClienteSerializer

    def get_queryset(self):
        # Primero aplicar el filtro de tenant (TenantAwareViewSet)
        queryset = super().get_queryset()
        
        queryset = queryset.annotate(
            cnt_interacciones=Count('interacciones', distinct=True),
            cnt_oportunidades=Count('oportunidades', distinct=True),
        ).order_by('-creado_en')

        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombres__icontains=search)       |
                Q(apellidos__icontains=search)     |
                Q(email__icontains=search)         |
                Q(telefono__icontains=search)      |
                Q(codigo_cliente__icontains=search)
            )

        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)

        origen = self.request.query_params.get('origen', None)
        if origen:
            queryset = queryset.filter(origen=origen)

        agente_id = self.request.query_params.get('agente', None)
        if agente_id:
            queryset = queryset.filter(agentes__agente_id=agente_id, agentes__activo=True)

        return queryset

    def perform_create(self, serializer):
        # Asignar tenant_id automáticamente (de TenantAwareViewSet)
        # y asignar el usuario que lo crea
        serializer.save(
            tenant_id=self.request.tenant_id,
            creado_por=self.request.user
        )

    # ── Panel de seguimiento ──────────────────────────────────
    @action(detail=True, methods=['get'])
    def panel(self, request, pk=None):
        cliente = self.get_object()
        data    = ClienteSerializer(cliente, context={'request': request}).data
        return Response(data)

    # ── Interacciones ─────────────────────────────────────────
    @action(detail=True, methods=['get', 'post'])
    def interacciones(self, request, pk=None):
        cliente = self.get_object()
        if request.method == 'GET':
            qs         = cliente.interacciones.all()
            serializer = ClienteInteraccionSerializer(qs, many=True)
            return Response(serializer.data)
        serializer = ClienteInteraccionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(cliente=cliente, agente=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Oportunidades ─────────────────────────────────────────
    @action(detail=True, methods=['get', 'post'])
    def oportunidades(self, request, pk=None):
        cliente = self.get_object()
        if request.method == 'GET':
            qs         = cliente.oportunidades.all()
            serializer = ClienteOportunidadSerializer(qs, many=True)
            return Response(serializer.data)
        serializer = ClienteOportunidadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(cliente=cliente, agente=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Recordatorios ─────────────────────────────────────────
    @action(detail=True, methods=['get', 'post'])
    def recordatorios(self, request, pk=None):
        cliente = self.get_object()
        if request.method == 'GET':
            qs         = cliente.recordatorios.all()
            serializer = ClienteRecordatorioSerializer(qs, many=True)
            return Response(serializer.data)
        serializer = ClienteRecordatorioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(cliente=cliente, usuario=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ── Asignar agente ────────────────────────────────────────
    @action(detail=True, methods=['post'])
    def asignar_agente(self, request, pk=None):
        cliente   = self.get_object()
        agente_id = request.data.get('agente_id')
        if not agente_id:
            return Response({'error': 'agente_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        ca, created = ClienteAgente.objects.get_or_create(
            cliente=cliente,
            agente_id=agente_id,
            defaults={'activo': True}
        )
        if not created:
            ca.activo = True
            ca.save()
        return Response(ClienteAgenteSerializer(ca).data, status=status.HTTP_200_OK)

    # ── Resumen para el panel ─────────────────────────────────
    @action(detail=True, methods=['get'])
    def resumen(self, request, pk=None):
        cliente = self.get_object()
        return Response({
            'cliente': {
                'id':              cliente.id,
                'codigo_cliente':  cliente.codigo_cliente,
                'nombre_completo': str(cliente),
                'estado':          cliente.estado,
                'email':           cliente.email,
                'telefono':        cliente.telefono,
            },
            'stats': {
                'total_interacciones': cliente.interacciones.count(),
                'total_oportunidades': cliente.oportunidades.count(),
                'total_recordatorios': cliente.recordatorios.count(),
                'oportunidades_abiertas': cliente.oportunidades.exclude(
                    etapa__in=['cerrado', 'perdido']
                ).count(),
                'recordatorios_pendientes': cliente.recordatorios.filter(atendido=False).count(),
            },
            'ultima_interaccion': ClienteInteraccionSerializer(
                cliente.interacciones.first()
            ).data if cliente.interacciones.exists() else None,
            'oportunidades_activas': ClienteOportunidadSerializer(
                cliente.oportunidades.exclude(etapa__in=['cerrado', 'perdido']),
                many=True
            ).data,
            'recordatorios_pendientes': ClienteRecordatorioSerializer(
                cliente.recordatorios.filter(atendido=False),
                many=True
            ).data,
        })

    @action(detail=False, methods=['get'])
    def reporte(self, request):
        queryset = self.get_queryset()

        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        queryset = filter_periodo(queryset, 'creado_en', fecha_inicio, fecha_fin)

        serializer = ReporteClienteSerializer(queryset, many=True)
        data = serializer.data

        if request.query_params.get('format') == 'pdf':
            headers = [
                'Codigo', 'Nombre', 'Email', 'Telefono', 'Estado', 'Origen', 'Creado'
            ]
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
            return build_pdf_response(
                'Reporte de Clientes',
                headers,
                rows,
                filename='reporte_clientes.pdf'
            )

        return Response(data)
