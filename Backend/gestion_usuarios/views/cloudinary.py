from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from shared.services.cloudinary_service import CloudinaryService


class UploadImageView(APIView):

    def post(self, request):
        file = request.FILES.get("imagen")

        if not file:
            return Response({"error": "No se envió imagen"}, status=400)

        data = CloudinaryService.upload_image(file, folder="test")

        return Response(data)