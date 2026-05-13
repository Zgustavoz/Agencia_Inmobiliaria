# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import viewsets, filters, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from ..models.propiedad import Propiedad
from ..serializers.propiedad import PropiedadSerializer
from ..filters.propiedad_filter import PropiedadFilter
from rest_framework.decorators import action

# Importar la base de tenant awareness
from gestion_usuarios.views.base import TenantAwareViewSet

class PropiedadViewSet(TenantAwareViewSet):
    queryset = Propiedad.objects.all().order_by('-creado_en')
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_class = PropiedadFilter

    search_fields = [
        'titulo',
        'codigo_propiedad',
        'descripcion',
        'zona__ciudad',
        'zona__zona'
    ]

    ordering_fields = [
        'precio',
        'creado_en',
        'dormitorios'
    ]

    def get_queryset(self):
        """Filtra por tenant + aplica filtros adicionales del usuario."""
        # Primero aplicar el filtro de tenant (TenantAwareViewSet)
        queryset = super().get_queryset()

        # Filtro por zona
        zona_id = self.request.query_params.get('zona_id')
        if zona_id:
            queryset = queryset.filter(zona_id=zona_id)

        # Filtro por publicación móvil
        publicado_movil = self.request.query_params.get('publicado_movil')
        if publicado_movil is not None:
            val = publicado_movil.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(publicado_movil=val)

        # Filtro por estado de la propiedad
        estado = self.request.query_params.get('estado_propiedad')
        if estado:
            queryset = queryset.filter(estado_propiedad=estado)

        # Filtro por destacada
        destacada = self.request.query_params.get('destacada')
        if destacada is not None:
            val = destacada.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(destacada=val)

        return queryset

    def _validate_tenant_limits(self):
        """
        Valida que el tenant no haya excedido el límite de propiedades según su plan.
        ✓ Restricción de plan (paso 9 del plan)
        """
        if not hasattr(self.request, 'tenant') or not self.request.tenant:
            return
        
        # Contar propiedades existentes del tenant
        count = Propiedad.objects.filter(tenant=self.request.tenant).count()
        max_allowed = self.request.tenant.max_propiedades
        
        if count >= max_allowed:
            raise PermissionDenied(
                f"Has alcanzado el límite de {max_allowed} propiedades para tu plan {self.request.tenant.get_plan_display()}. "
                f"Considera actualizar tu suscripción."
            )

    @action(detail=False, methods=['get'])
    def buscar(self, request):
        q = request.query_params.get('q', '')

        # Filtrar por tenant actual
        propiedades = Propiedad.objects.filter(
            Q(tenant_id=request.tenant_id) & (
                Q(titulo__icontains=q) |
                Q(codigo_propiedad__icontains=q)
            )
        )[:15]

        data = [
            {
                "id": p.id_propiedad,
                "nombre": f"{p.codigo_propiedad} - {p.titulo}"
            }
            for p in propiedades
        ]

        return Response(data)