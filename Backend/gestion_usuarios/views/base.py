# pylint: disable=C0114,C0115,C0116
from rest_framework import viewsets

class BaseViewSet(viewsets.ModelViewSet):
    modulo = None

    def _get_datos(self, instance):
        return {}