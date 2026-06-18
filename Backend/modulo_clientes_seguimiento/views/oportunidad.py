from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.cliente_oportunidad import ClienteOportunidad
from ..serializers.cliente_oportunidad import ClienteOportunidadSerializer


class ClienteOportunidadViewSet(viewsets.ModelViewSet):
    queryset = ClienteOportunidad.objects.all()
    serializer_class = ClienteOportunidadSerializer
    permission_classes = [IsAuthenticated]
