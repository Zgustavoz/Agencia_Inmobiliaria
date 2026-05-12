from django.urls import path
from .views import VencimientoListView

urlpatterns = [
    path('', VencimientoListView.as_view(), name='vencimientos'),
]