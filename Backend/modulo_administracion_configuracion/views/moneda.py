from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ..models.moneda import Moneda
from ..serializers.moneda import MonedaSerializer


class MonedaListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Listar todas las monedas."""
        monedas = Moneda.objects.all().order_by('id_moneda')
        serializer = MonedaSerializer(monedas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Crear una nueva moneda."""
        serializer = MonedaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonedaDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Moneda.objects.get(pk=pk)
        except Moneda.DoesNotExist:
            return None

    def get(self, request, pk):
        """Obtener una moneda por ID."""
        moneda = self.get_object(pk)
        if moneda is None:
            return Response(
                {'error': 'Moneda no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = MonedaSerializer(moneda)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Actualizar completamente una moneda."""
        moneda = self.get_object(pk)
        if moneda is None:
            return Response(
                {'error': 'Moneda no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = MonedaSerializer(moneda, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Actualizar parcialmente una moneda."""
        moneda = self.get_object(pk)
        if moneda is None:
            return Response(
                {'error': 'Moneda no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = MonedaSerializer(moneda, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Eliminar una moneda."""
        moneda = self.get_object(pk)
        if moneda is None:
            return Response(
                {'error': 'Moneda no encontrada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        moneda.delete()
        return Response(
            {'mensaje': 'Moneda eliminada correctamente.'},
            status=status.HTTP_204_NO_CONTENT
        )