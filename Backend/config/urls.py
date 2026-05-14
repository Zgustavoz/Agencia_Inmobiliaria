from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf.urls.static import static
from django.conf import settings

def health(_request):
    """Endpoint para verificar que el servidor está vivo."""
    return HttpResponse("OK")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
    path('gestion_usuarios/', include('gestion_usuarios.urls')),
    path('api/admin-config/', include('modulo_administracion_configuracion.urls')),
    path('api/inmuebles/', include('modulo_inmuebles.urls')),
    path('api/clientes/', include('modulo_clientes_seguimiento.urls')),
    path('api/', include('modulo_contratos.urls')),
    path('api/vencimientos/', include('modulo_vencimientos.urls')),
    path('api/tasacion-ia/', include('modulo_tasacion_ia.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
