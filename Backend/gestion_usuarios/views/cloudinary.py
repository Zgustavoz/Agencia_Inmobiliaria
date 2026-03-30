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
    
    def delete(self, request):
        public_id = request.data.get("public_id")
        if not public_id:
            return Response({"error": "No se proporcionó public_id"}, status=400)

        result = CloudinaryService.delete_image(public_id)
        return Response(result)