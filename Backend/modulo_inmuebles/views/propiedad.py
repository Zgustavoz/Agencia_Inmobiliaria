# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from ..models.propiedad import Propiedad
from ..serializers.propiedad import PropiedadSerializer

class PropiedadViewSet(viewsets.ModelViewSet):
    queryset = Propiedad.objects.all().order_by('-creado_en')
    serializer_class = PropiedadSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Cualquiera ve, solo logueados editan

    def get_queryset(self):
        # Ejemplo: Filtrar por zona si viene en la URL (?zona_id=1)
        queryset = super().get_queryset()
        zona_id = self.request.query_params.get('zona_id')
        if zona_id:
            queryset = queryset.filter(id_zona=zona_id)
        return queryset