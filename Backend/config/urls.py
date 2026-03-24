from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def health(_request):
    """Endpoint para verificar que el servidor está vivo."""
    return HttpResponse("OK")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
    path('gestion_usuarios/', include('gestion_usuarios.urls')),
    path('api/admin-config/', include('modulo_administracion_configuracion.urls')),
]
