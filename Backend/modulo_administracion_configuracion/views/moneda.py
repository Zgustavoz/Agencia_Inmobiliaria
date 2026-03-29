# pylint: disable=E1101, E1102, C0114, C0115, C0116
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from ..models.moneda import Moneda
from ..serializers.moneda import MonedaSerializer


class MonedaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Moneda.objects.all().order_by('id_moneda')
    serializer_class = MonedaSerializer


    def get_queryset(self):
        queryset = Moneda.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(codigo__icontains=search) |
                Q(simbolo__icontains=search)
            )
        estado = self.request.query_params.get('estado')
        if estado is not None:
            estado = estado.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(estado=estado)

        return queryset.order_by('id_moneda')
