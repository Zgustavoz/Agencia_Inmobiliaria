# pylint: disable=C0114,C0115,C0116,no-member,W0613
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Permiso
from ..serializers import PermisoSerializer
from ..permissions import EsAdmin
from .base import BaseViewSet

class PermisoViewSet(BaseViewSet):
    modulo             = 'Permisos'
    queryset           = Permiso.objects.all().order_by('nombre')
    serializer_class   = PermisoSerializer
    permission_classes = [EsAdmin]

    def get_queryset(self):
        queryset = Permiso.objects.all().order_by('nombre')
        estado = self.request.query_params.get('estado', None)
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(codigo__icontains=search)
            )
        return queryset

    @action(detail=True, methods=['post'])
    def toggle_estado(self, request, pk=None):
        permiso        = self.get_object()
        permiso.estado = not permiso.estado
        permiso.save()
        return Response({
            'message': f"Permiso {'activado' if permiso.estado else 'desactivado'}",
            'estado':  permiso.estado
        })