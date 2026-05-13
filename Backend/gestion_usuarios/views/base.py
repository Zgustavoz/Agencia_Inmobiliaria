# pylint: disable=C0114,C0115,C0116
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


class BaseViewSet(viewsets.ModelViewSet):
    """ViewSet base para mantener compatibilidad con vistas existentes."""
    modulo = None


class TenantAwareViewSet(BaseViewSet):
    """
    Base ViewSet que automatiza el aislamiento de datos por tenant.
    
    Requerimientos:
    - El modelo debe tener un campo 'tenant' ForeignKey.
    - El request debe tener 'request.tenant_id' (asignado por CookieJWTAuthentication).
    
    Proporciona:
    - Filtrado automático en get_queryset()
    - Asignación automática de tenant_id en perform_create()
    - Validación de propiedad de tenant en get_object()
    """
    modulo = None
    
    def get_queryset(self):
        """Filtra el queryset para solo devolver registros del tenant actual."""
        queryset = super().get_queryset()
        
        if not hasattr(self.request, 'tenant_id') or not self.request.tenant_id:
            # Si no hay tenant_id en el request, retornar queryset vacío
            return queryset.none()
        
        # Filtrar por tenant
        return queryset.filter(tenant_id=self.request.tenant_id)
    
    def get_object(self):
        """
        Obtiene el objeto y valida que pertenece al tenant actual.
        Previene acceso cruzado por ID forzado en la URL.
        """
        obj = super().get_object()
        
        if not hasattr(self.request, 'tenant_id') or not self.request.tenant_id:
            raise PermissionDenied("No tenant context provided.")
        
        # Validar que el objeto pertenece al tenant actual
        if hasattr(obj, 'tenant_id') and obj.tenant_id != self.request.tenant_id:
            raise PermissionDenied(
                f"No tienes permiso para acceder a este recurso (tenant mismatch)."
            )
        
        return obj
    
    def perform_create(self, serializer):
        """Asigna automáticamente el tenant_id al crear un nuevo registro."""
        if not hasattr(self.request, 'tenant_id') or not self.request.tenant_id:
            raise PermissionDenied("No tenant context provided.")
        
        # Validar limites de plan (si existen)
        if hasattr(self.request, 'tenant') and self.request.tenant:
            # Subclases pueden sobrescribir esto para validaciones de plan específicas
            self._validate_tenant_limits()
        
        serializer.save(tenant_id=self.request.tenant_id)
    
    def perform_update(self, serializer):
        """Asegura que no se intente cambiar el tenant_id en actualización."""
        # El tenant_id no debe cambiar, está fijado en la creación
        serializer.save()
    
    def _validate_tenant_limits(self):
        """
        Hook para validaciones de límites de plan (sobreescribir en subclases).
        Por ejemplo, verificar max_propiedades para el plan del tenant.
        """
        pass