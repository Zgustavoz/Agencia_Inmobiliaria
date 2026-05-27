from .actividad_sistema import ActividadSistemaViewSet
from gestion_usuarios.permissions.superadmin import IsGlobalSuperAdmin

class GlobalActividadSistemaViewSet(ActividadSistemaViewSet):
    """
    Vista global de bitácora para el SuperAdmin.
    Permite ver las acciones de todos los usuarios de todos los tenants.
    """
    permission_classes = [IsGlobalSuperAdmin]

    def get_queryset(self):
        # El SuperAdmin ve TODO, sin filtros de tenant
        queryset = super().get_queryset()
        
        # Filtros adicionales opcionales
        tenant_id = self.request.query_params.get('tenant_id')
        if tenant_id:
            queryset = queryset.filter(usuario__tenant_id=tenant_id)
            
        return queryset
