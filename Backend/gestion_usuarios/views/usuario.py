# pylint: disable=C0114,C0115,C0116,no-member,W0613
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Prefetch
from ..models import Usuario, Rol
from ..serializers import UsuarioSerializer
from ..permissions import EsAdminOSoloLectura
from .base import BaseViewSet

class UsuarioPagination(PageNumberPagination):
    page_size              = 10
    page_size_query_param  = 'page_size'
    max_page_size          = 50

class UsuarioViewSet(BaseViewSet):
    modulo             = 'Usuarios'
    serializer_class   = UsuarioSerializer
    permission_classes = [EsAdminOSoloLectura]
    pagination_class   = UsuarioPagination

    def get_queryset(self):
        queryset = Usuario.objects.all().prefetch_related('roles').distinct()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search)   |
                Q(email__icontains=search)      |
                Q(nombres__icontains=search)    |
                Q(apellidos__icontains=search)
            )
        roles = self.request.query_params.getlist('roles[]', None)
        if roles:
            for rol_id in roles:
                queryset = queryset.filter(roles__id=rol_id)
        estado = self.request.query_params.get('estado', None)
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(creado_en__date__gte=fecha_desde)
        fecha_hasta = self.request.query_params.get('fecha_hasta', None)
        if fecha_hasta:
            queryset = queryset.filter(creado_en__date__lte=fecha_hasta)
        return queryset.order_by('-creado_en')

    def perform_update(self, serializer):
        instance              = serializer.instance
        instance._datos_antes = {
            'username':  instance.username,
            'email':     instance.email,
            'nombres':   instance.nombres,
            'apellidos': instance.apellidos,
            'estado':    instance.estado,
            'telefono':  instance.telefono,
            'roles':     list(instance.roles.values_list('nombre', flat=True)),
        }
        serializer.save()

    @action(detail=True, methods=['post'])
    def toggle_estado(self, request, pk=None):
        usuario = self.get_object()
        if usuario.id == request.user.id:
            return Response(
                {'error': 'No puedes cambiar tu propio estado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        usuario.estado = not usuario.estado
        usuario.save()
        return Response({
            'message': f"Usuario {'activado' if usuario.estado else 'desactivado'}",
            'estado':  usuario.estado
        })

    @action(detail=False, methods=['get'])
    def me(self, request):
        return Response(self.get_serializer(request.user).data)