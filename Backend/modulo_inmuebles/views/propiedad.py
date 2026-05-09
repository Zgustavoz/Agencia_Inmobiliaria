# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from ..models.propiedad import Propiedad
from ..serializers.propiedad import PropiedadSerializer
from ..filters.propiedad_filter import PropiedadFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

class PropiedadViewSet(viewsets.ModelViewSet):
    queryset = Propiedad.objects.all().order_by('-creado_en')
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] #IsAuthenticatedOrReadOnly

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

    @action(detail=False, methods=['get'])
    def buscar(self, request):
        q = request.query_params.get('q', '')

        propiedades = Propiedad.objects.filter(
            Q(titulo__icontains=q) |
            Q(codigo_propiedad__icontains=q)
        )[:15]

        data = [
            {
                "id": p.id_propiedad,
                "nombre": f"{p.codigo_propiedad} - {p.titulo}"
            }
            for p in propiedades
        ]

        return Response(data)