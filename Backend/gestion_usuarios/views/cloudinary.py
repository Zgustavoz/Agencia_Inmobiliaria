from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from shared.services.cloudinary_service import CloudinaryService


class UploadImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request):
        file = request.FILES.get("imagen") or request.FILES.get("image")
        folder = request.data.get("folder", "users/profiles")

        if not file:
            return Response({"error": "No se envió imagen"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = CloudinaryService.upload_image(file, folder=folder)
            return Response(data, status=status.HTTP_201_CREATED)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(
                {"error": "No se pudo subir la imagen en este momento"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )