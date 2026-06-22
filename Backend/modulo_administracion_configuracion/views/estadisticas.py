from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from modulo_administracion_configuracion.services.estadisticas_dashboard import (
    EstadisticasDashboardService
)


class DashboardEstadisticasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenant

        if not tenant:
            return Response({"error": "Usuario sin tenant"}, status=400)

        data = EstadisticasDashboardService.dashboard_tenant(tenant)

        return Response(data)
    
class DashboardGlobalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.es_admin:
            return Response({"error": "No autorizado"}, status=403)

        data = {
            "tenants": {
                "total": Tenant.objects.count(),
                "activos": Tenant.objects.filter(estado=True).count(),
            },
            "usuarios": {
                "total": Usuario.objects.count(),
            },
            "propiedades": {
                "total": Propiedad.objects.count(),
            },
            "contratos": {
                "total": Contrato.objects.count(),
            }
        }

        return Response(data)