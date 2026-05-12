from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from modulo_contratos.models import DocumentoContrato
from modulo_contratos.serializers.documento_contrato import DocumentoContratoSerializer


class DocumentoContratoViewSet(viewsets.ModelViewSet):
    queryset = DocumentoContrato.objects.all().order_by('-creado_en')
    serializer_class = DocumentoContratoSerializer
    permission_classes = [IsAuthenticated] #IsAutenticated

    filterset_fields = ['contrato']