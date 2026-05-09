# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from ..models.propiedad import Propiedad
from ..serializers.propiedad import PropiedadSerializer

class PropiedadViewSet(viewsets.ModelViewSet):
    queryset = Propiedad.objects.all().order_by('-creado_en')
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Cualquiera ve, solo logueados editan
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'codigo_propiedad']
    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtro por zona
        zona_id = self.request.query_params.get('zona_id')
        if zona_id:
            queryset = queryset.filter(zona_id=zona_id)

        # Filtro por publicación móvil (Estilo Moneda)
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