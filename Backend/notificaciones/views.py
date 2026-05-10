from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notificacion, DispositivoFCM
from .serializers import NotificacionSerializer


class NotificacionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificacionSerializer

    def get_queryset(self):
        qs = Notificacion.objects.filter(destinatario=self.request.user)
        if self.request.query_params.get('no_leidas'):
            qs = qs.filter(leida=False)
        return qs

    @action(detail=False, methods=['get'])
    def count(self, request):
        total = Notificacion.objects.filter(destinatario=request.user, leida=False).count()
        return Response({'count': total})

    @action(detail=True, methods=['patch'], url_path='marcar-leida')
    def marcar_leida(self, request, pk=None):
        notif = self.get_object()
        notif.leida = True
        notif.save(update_fields=['leida'])
        return Response(self.get_serializer(notif).data)

    @action(detail=False, methods=['post'], url_path='marcar-todas-leidas')
    def marcar_todas_leidas(self, request):
        Notificacion.objects.filter(destinatario=request.user, leida=False).update(leida=True)
        return Response({'ok': True})


class RegistrarTokenFCMView(APIView):
    def post(self, request):
        token = request.data.get('token')
        plataforma = request.data.get('plataforma', 'android')

        if not token:
            return Response({'error': 'token requerido'}, status=status.HTTP_400_BAD_REQUEST)

        DispositivoFCM.objects.update_or_create(
            token=token,
            defaults={'usuario': request.user, 'plataforma': plataforma, 'activo': True},
        )
        return Response({'ok': True})
