from rest_framework import permissions

class IsGlobalSuperAdmin(permissions.BasePermission):
    """
    Permiso que solo permite el acceso a administradores globales.
    Un administrador global tiene es_admin=True y NO pertenece a ningún tenant.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.es_admin and 
            request.user.tenant is None
        )
