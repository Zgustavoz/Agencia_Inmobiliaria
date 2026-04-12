from rest_framework import viewsets
from ..models.zona import Zona
from ..serializers.zona import ZonaSerializer

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.filter(estado=True)
    serializer_class = ZonaSerializer