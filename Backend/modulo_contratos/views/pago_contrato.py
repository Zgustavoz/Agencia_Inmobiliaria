from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from modulo_contratos.models import PagoContrato
from modulo_contratos.serializers.pago_contrato import PagoContratoSerializer


class PagoContratoViewSet(viewsets.ModelViewSet):
    queryset = PagoContrato.objects.all().order_by('-fecha_vencimiento')
    serializer_class = PagoContratoSerializer
    permission_classes = [IsAuthenticated]

    filterset_fields = ['estado', 'contrato']