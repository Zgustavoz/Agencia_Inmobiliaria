import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError


class CloudinaryService:

    @staticmethod
    def upload_image(file, folder="general"):
        if not file:
            raise ValueError("No se proporcionó archivo")

        try:
            result = cloudinary.uploader.upload(
                file,
                folder=folder
            )
        except CloudinaryError as exc:
            # Convertimos errores del SDK en errores de dominio para responder 4xx desde la API.
            raise ValueError(f"Error de Cloudinary: {exc}") from exc

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }

    @staticmethod
    def delete_image(public_id):
        return cloudinary.uploader.destroy(public_id)