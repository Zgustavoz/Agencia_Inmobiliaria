# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from shared.services.cloudinary_service import CloudinaryService
from ..models.propiedad import Propiedad
from ..models.imagen_propiedad import PropiedadImagen

# 1. DEFINIR ESTO PRIMERO
class PropiedadImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropiedadImagen
        fields = ('id_imagen', 'url_imagen', 'principal', 'orden_visual')

# 2. LUEGO DEFINIR EL DE PROPIEDAD
class PropiedadSerializer(serializers.ModelSerializer):
    # Ahora sí Python sabe qué es PropiedadImagenSerializer
    imagenes = PropiedadImagenSerializer(many=True, read_only=True)
    
    imagenes_input = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    
    nombre_zona = serializers.ReadOnlyField(source='zona.zona')
    nombre_moneda = serializers.ReadOnlyField(source='moneda.nombre')

    class Meta:
        model = Propiedad
        fields = '__all__'
        read_only_fields = ('creado_por', 'creado_en', 'actualizado_en')

    def create(self, validated_data):
        imagenes_subidas = validated_data.pop('imagenes_input', [])
        
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['creado_por'] = request.user
            if not validated_data.get('id_agente_publicador'):
                validated_data['id_agente_publicador'] = request.user

        propiedad = super().create(validated_data)

        for index, file in enumerate(imagenes_subidas):
            try:
                upload_data = CloudinaryService.upload_image(file, folder="inmuebles/galeria")
                
                PropiedadImagen.objects.create(
                    propiedad=propiedad,
                    url_imagen=upload_data['url'],
                    nombre_archivo=upload_data['public_id'], 
                    principal=(index == 0),
                    orden_visual=index + 1
                )
            except Exception as e:
                print(f"Error subiendo imagen a Cloudinary: {e}")

        return propiedad