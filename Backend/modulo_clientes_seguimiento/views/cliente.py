# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from ..models.cliente import Cliente
from ..serializers.cliente import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('-creado_en')
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombres', 'apellidos', 'email', 'nro_documento']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Aquí se podrían agregar filtros específicos (por estado, por agente, etc.)
        return queryset
