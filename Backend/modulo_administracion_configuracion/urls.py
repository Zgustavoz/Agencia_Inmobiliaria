from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.moneda import MonedaViewSet

router = DefaultRouter()
router.register(r'monedas', MonedaViewSet, basename='moneda')

urlpatterns = [
    path('', include(router.urls)),
]