# gestion_usuarios/views/actividad_sistema.py  <---- hecho por JOse para la bitacora
from rest_framework import viewsets, mixins
from ..models.actividad_sistema import ActividadSistema
from ..serializers.actividad_sistema_serializer import ActividadSistemaSerializer
from ..permissions import EsAdmin # Usamos tu permiso de Admin


#temporal para probar ruta de la bitacora
from rest_framework.permissions import AllowAny

class ActividadSistemaViewSet(mixins.ListModelMixin, 
                              mixins.RetrieveModelMixin, 
                              viewsets.GenericViewSet):
    """
    Vista para consultar la bitácora. 
    Solo permite LISTAR y VER DETALLE (No crear, editar ni borrar).
    """
    queryset = ActividadSistema.objects.all().select_related('usuario')
    serializer_class = ActividadSistemaSerializer
    permission_classes = [AllowAny] # Solo el jefe puede ver esto

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros básicos por si el Front quiere buscar
        modulo = self.request.query_params.get('modulo')
        if modulo:
            queryset = queryset.filter(modulo__icontains=modulo)
        return queryset