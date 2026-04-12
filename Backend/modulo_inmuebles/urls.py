from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views.propiedad import PropiedadViewSet
from .views.zona import ZonaViewSet

router = DefaultRouter()
router.register(r'propiedades', PropiedadViewSet)
router.register(r'zonas', ZonaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]