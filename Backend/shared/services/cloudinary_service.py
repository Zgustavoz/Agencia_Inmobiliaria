import cloudinary.uploader


class CloudinaryService:

    @staticmethod
    def upload_image(file, folder="general"):
        if not file:
            raise ValueError("No se proporcionó archivo")

        result = cloudinary.uploader.upload(
            file,
            folder=folder
        )

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }

    @staticmethod
    def delete_image(public_id):
        return cloudinary.uploader.destroy(public_id)