from rest_framework.views import APIView
from rest_framework.response import Response

class VencimientoListView(APIView):
    def get(self, request):
        data = []
        return Response(data)