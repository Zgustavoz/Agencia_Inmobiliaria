# pylint: disable=C0114,C0115,C0116,no-member,W0613
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from ..models import Rol
from ..serializers import RolSerializer
from ..permissions import EsAdmin
from .base import BaseViewSet

class RolViewSet(BaseViewSet):
    modulo           = 'Roles'
    queryset         = Rol.objects.annotate(usuarios_count=Count('usuarios')).order_by('nombre')
    serializer_class = RolSerializer
    permission_classes = [EsAdmin]

    def get_queryset(self):
        queryset = Rol.objects.annotate(usuarios_count=Count('usuarios'))
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(descripcion__icontains=search)
            )
        estado = self.request.query_params.get('estado', None)
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        return queryset.order_by('nombre')

    @action(detail=True, methods=['post'])
    def toggle_estado(self, request, pk=None):
        rol = self.get_object()
        if rol.usuarios.filter(estado=True).exists():
            return Response(
                {'error': 'No puedes desactivar un rol con usuarios activos asignados'},
                status=status.HTTP_400_BAD_REQUEST
            )
        rol.estado = not rol.estado
        rol.save()
        return Response({
            'message': f"Rol {'activado' if rol.estado else 'desactivado'}",
            'estado':  rol.estado
        })

    @action(detail=True, methods=['post'])
    def asignar_permisos(self, request, pk=None):
        rol          = self.get_object()
        permisos_ids = request.data.get('permisos_ids', [])
        from ..models import Permiso
        permisos = Permiso.objects.filter(id__in=permisos_ids, estado=True)
        rol.permisos.set(permisos)
        return Response(self.get_serializer(rol).data)