from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.tasacion import ChatTasacionViewSet
from .views.busqueda_semantica import BusquedaSemanticaViewSet
# Creamos el enrutador
router = DefaultRouter()

# Registramos la vista. 
# Al poner 'tasar', las peticiones POST irán a /tasar/ (crear registro)
# y las peticiones GET irán a /tasar/ (listar historial del usuario)
router.register(r'tasar', ChatTasacionViewSet, basename='tasacion-ia')
router.register(r'busqueda-semantica', BusquedaSemanticaViewSet, basename='busqueda-semantica')
urlpatterns = [
    path('', include(router.urls)),
]