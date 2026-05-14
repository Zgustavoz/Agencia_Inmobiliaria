from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.moneda import MonedaViewSet
from .views.backup import BackupManagerView, RestoreBackupView
# Importamos la nueva vista de IA
from .views.reportes_ia import recibir_audio_reporte 

router = DefaultRouter()
router.register(r'monedas', MonedaViewSet, basename='moneda')

urlpatterns = [
    path('', include(router.urls)),
    path('backups/', BackupManagerView.as_view(), name='gestion-backups'),
    path('backups/restaurar/<str:filename>/', RestoreBackupView.as_view(), name='restaurar-backup'),
    
    # Nueva ruta para el procesamiento de voz
    path('reporte-voz/', recibir_audio_reporte, name='reportes_ia'),
]