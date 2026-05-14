# gestion_usuarios/views/actividad_sistema.py  <---- hecho por JOse para la bitacora
from hmac import compare_digest
from django.conf import settings
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from ..models.actividad_sistema import ActividadSistema
from ..permissions import EsAdmin
from ..serializers.actividad_sistema_serializer import ActividadSistemaSerializer


class ActividadSistemaViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    Vista para consultar la bitacora.
    Solo permite listar y ver detalle.
    """
    queryset = ActividadSistema.objects.all().select_related('usuario')
    serializer_class = ActividadSistemaSerializer
    permission_classes = [EsAdmin]
    access_cookie_name = 'bitacora_access'

    def _get_cookie_value(self):
        return str(self.request.user.id)

    def _require_password_access(self):
        if self.request.COOKIES.get(self.access_cookie_name) != self._get_cookie_value():
            raise PermissionDenied(detail='Debes ingresar la contrasena de bitacora.')

    def get_queryset(self):
        queryset = super().get_queryset()
        modulo = self.request.query_params.get('modulo')
        if modulo:
            queryset = queryset.filter(modulo__icontains=modulo)
        return queryset

    def list(self, request, *args, **kwargs):
        self._require_password_access()
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self._require_password_access()
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='verificar-clave')
    def verificar_clave(self, request):
        password = str(request.data.get('password', ''))
        configured_password = settings.BITACORA_ACCESS_PASSWORD

        if not configured_password:
            return Response(
                {'error': 'La contrasena de bitacora no esta configurada.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not password:
            return Response(
                {'error': 'Debes ingresar la contrasena de bitacora.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not compare_digest(password, configured_password):
            return Response(
                {'error': 'Contrasena incorrecta.'},
                status=status.HTTP_403_FORBIDDEN
            )

        response = Response(
            {'message': 'Acceso a bitacora concedido.'},
            status=status.HTTP_200_OK
        )
        response.set_cookie(
            key=self.access_cookie_name,
            value=self._get_cookie_value(),
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
            max_age=60 * 60 * 12,
        )
        return response
