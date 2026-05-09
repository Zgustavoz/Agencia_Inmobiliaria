# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from ..models.visita import Visita, HorarioDisponibilidad
from ..serializers.visita import VisitaSerializer, HorarioDisponibilidadSerializer

class HorarioDisponibilidadViewSet(ModelViewSet):
    queryset = HorarioDisponibilidad.objects.all()
    serializer_class = HorarioDisponibilidadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        propiedad_id = self.request.query_params.get('propiedad_id')
        if propiedad_id:
            queryset = queryset.filter(propiedad_id=propiedad_id)
        return queryset

class VisitaViewSet(ModelViewSet):
    queryset = Visita.objects.all().order_by('-fecha_visita', '-hora_inicio')
    serializer_class = VisitaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente_id')
        agente_id = self.request.query_params.get('agente_id')
        propiedad_id = self.request.query_params.get('propiedad_id')
        
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)
        if agente_id:
            queryset = queryset.filter(agente_id=agente_id)
        if propiedad_id:
            queryset = queryset.filter(propiedad_id=propiedad_id)
            
        return queryset
