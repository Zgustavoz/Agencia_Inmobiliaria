# pylint: disable=C0114
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RolViewSet, PermisoViewSet, UsuarioViewSet,
    LoginView, RegistroView, RefreshView,
    LogoutView, PasswordResetView, RestablecerPasswordView,
    UploadImageView
)

router = DefaultRouter()
router.register('roles',    RolViewSet,     basename='roles')
router.register('permisos', PermisoViewSet, basename='permisos')
router.register('usuarios', UsuarioViewSet, basename='usuarios')


urlpatterns = [
    path('',                                      include(router.urls)),
    path('auth/login/',                           LoginView.as_view(),              name='login'),
    path('auth/registro/',                        RegistroView.as_view(),           name='registro'),
    path('auth/refresh/',                         RefreshView.as_view(),            name='refresh'),
    path('auth/logout/',                          LogoutView.as_view(),             name='logout'),
    path('auth/recuperar-password/',              PasswordResetView.as_view(),      name='recuperar_password'),
    path('auth/restablecer-password/<uidb64>/<token>/', RestablecerPasswordView.as_view(), name='restablecer_password'),
    path("upload-image/", UploadImageView.as_view()),
]