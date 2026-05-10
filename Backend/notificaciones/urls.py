from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificacionViewSet, RegistrarTokenFCMView

router = DefaultRouter()
router.register('', NotificacionViewSet, basename='notificacion')

urlpatterns = [
    path('registrar-token/', RegistrarTokenFCMView.as_view(), name='registrar-token-fcm'),
    path('', include(router.urls)),
]
