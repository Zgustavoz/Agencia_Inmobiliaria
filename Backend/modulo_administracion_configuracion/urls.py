from django.urls import path
from .views.moneda import MonedaListCreateView, MonedaDetailView

urlpatterns = [
    path('monedas/', MonedaListCreateView.as_view(), name='moneda-list-create'),
    path('monedas/<int:pk>/', MonedaDetailView.as_view(), name='moneda-detail'),
]