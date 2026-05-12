# pylint: disable=C0114
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.cliente import ClienteViewSet
from .views.visita  import VisitaViewSet, HorarioDisponibilidadViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='clientes')
router.register(r'visitas',  VisitaViewSet,  basename='visitas')
router.register(r'horarios-disponibilidad', HorarioDisponibilidadViewSet, basename='horarios-disponibilidad')
router.register(r'horarios', HorarioDisponibilidadViewSet, basename='horarios')

urlpatterns = [
    path('', include(router.urls)),
]
