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
    path('api/inmuebles/', include('modulo_inmuebles.urls')),
<<<<<<< HEAD
    path('api/notificaciones/', include('notificaciones.urls')),
=======
    path('api/clientes/', include('modulo_clientes_seguimiento.urls')),
<<<<<<< HEAD
    path('api/', include('modulo_contratos.urls'))
>>>>>>> 5f3ba76e83582ab228be23bc9ed9b4651b90fb69
=======
    path('api/', include('modulo_contratos.urls')),
    path('api/vencimientos/', include('modulo_vencimientos.urls')),
    path('api/tasacion-ia/', include('modulo_tasacion_ia.urls')),
>>>>>>> 02bcc1fcabe63ec9d796978521336aee582c8cdc
]
