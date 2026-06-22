from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.moneda import MonedaViewSet
from .views.backup import BackupManagerView, RestoreBackupView
from .views.tenant_admin import SuperAdminTenantViewSet
# Importamos la nueva vista de IA
from .views.reportes_ia import recibir_audio_reporte
from .views.reportes_globales import ReportesGlobalesView

from .views.estadisticas import DashboardEstadisticasView, DashboardGlobalView

router = DefaultRouter()
router.register(r'monedas', MonedaViewSet, basename='moneda')
router.register(r'admin-tenants', SuperAdminTenantViewSet, basename='admin-tenants')

urlpatterns = [
    path('', include(router.urls)),
    path('backups/', BackupManagerView.as_view(), name='gestion-backups'),
    path('backups/restaurar/<str:filename>/', RestoreBackupView.as_view(), name='restaurar-backup'),
    
    # Nueva ruta para el procesamiento de voz
    path('reporte-voz/', recibir_audio_reporte, name='reportes_ia'),
    path('reportes-globales/', ReportesGlobalesView.as_view(), name='reportes-globales'),

    #Estadisticas
    path('estadisticas/', DashboardEstadisticasView.as_view(), name='estadisticas-tenant'),
    path('estadisticas-globales/', DashboardGlobalView.as_view(), name='estadisticas-globales'),
]