import json
import requests
from io import BytesIO
import google.generativeai as genai
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from ..models.busqueda_semantica import BusquedaSemanticaIA
from ..serializer.busqueda_semantica import BusquedaSemanticaIASerializer

# Conexión directa con tus módulos reales
from modulo_inmuebles.models import Propiedad
from modulo_inmuebles.serializers import PropiedadSerializer

class BusquedaSemanticaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BusquedaSemanticaIASerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return BusquedaSemanticaIA.objects.filter(usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        instance = serializer.save(usuario=self.request.user)
        instance.refresh_from_db() 

        # 1. Obtener los parámetros usando Gemini
        filtros_json = self.extraer_parametros_con_ia(instance)
        
        if not filtros_json:
            return Response(
                {"error": "No se pudo interpretar la búsqueda. Intenta ser más específico."}, 
                status=400
            )

        # 2. Guardar lo que entendió la IA en el historial
        instance.filtros_extraidos_ia = filtros_json
        instance.save()

        # 3. Construir la consulta a la base de datos de Propiedades reales
        propiedades_filtradas = self.buscar_propiedades(filtros_json)

        # 4. Serializar las propiedades encontradas pasándole el contexto del request
        propiedades_data = PropiedadSerializer(
            propiedades_filtradas, 
            many=True, 
            context={'request': request}
        ).data

        # 5. Retornar la respuesta final estructurada para Flutter
        return Response({
            "busqueda_id": instance.id,
            "ia_entendio": filtros_json,
            "resultados_count": propiedades_filtradas.count(),
            "resultados": propiedades_data  # <-- Ya conectado y devolviendo la data real
        }, status=200)

    def extraer_parametros_con_ia(self, instance):
        genai.configure(api_key=settings.GEMINI_API_KEY, transport='rest')
        
        instruccion_maestra = """
        Eres un asistente experto en búsqueda inmobiliaria en Bolivia.
        El usuario te dará un texto o un audio explicándote qué busca.
        Tu trabajo es extraer los filtros de búsqueda y devolverlos ESTRICTAMENTE en formato JSON.
        
        REGLAS:
        1. No inventes datos. Si el usuario no menciona un parámetro, pon su valor como null.
        2. Los campos del JSON deben ser EXACTAMENTE estos:
           - "ubicacion": (string o null, ej: "Equipetrol", "Urbarí", "Norte")
           - "precio_max": (número o null)
           - "precio_min": (número o null)
           - "operacion": (string o null, OBLIGATORIAMENTE debe ser uno de estos dos: "Para Vender" o "Para Alquilar")
           - "tipo_propiedad": (string o null, ej: "Apartment", "Luxury Villa", "Casa", "Terreno")
        
        EJEMPLOS:
        Usuario: "Estoy buscando una casa por equipetrol"
        {"ubicacion": "Equipetrol", "precio_max": null, "precio_min": null, "operacion": "Para Vender", "tipo_propiedad": "Casa"}
        
        Usuario: "Busco departamento en alquiler"
        {"ubicacion": null, "precio_max": null, "precio_min": null, "operacion": "Para Alquilar", "tipo_propiedad": "Apartment"}
        """

        # 🛠️ MEJORA: Forzamos a Gemini a responder única y exclusivamente un JSON estructurado
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-lite', 
            system_instruction=instruccion_maestra,
            generation_config={"response_mime_type": "application/json"}
        )
        
        contenido_mensaje = []

        if instance.mensaje_texto:
            contenido_mensaje.append(instance.mensaje_texto)
            
        if instance.audio_busqueda:
            try:
                response_audio = requests.get(instance.audio_busqueda.url)
                
                # 🛠️ MEJORA: Detectar dinámicamente si es m4a/aac u otro contenedor para guiar a Gemini
                url_audio = instance.audio_busqueda.url.lower()
                mime_type = "audio/mp3"
                if ".m4a" in url_audio:
                    mime_type = "audio/m4a"
                elif ".aac" in url_audio:
                    mime_type = "audio/aac"

                audio_data = {
                    "mime_type": mime_type, 
                    "data": response_audio.content
                }
                contenido_mensaje.append(audio_data)
            except Exception as e:
                print(f"Error procesando audio: {e}")

        if not contenido_mensaje:
            return None

        response = model.generate_content(contenido_mensaje)
            
        try:
            # Como forzamos response_mime_type, ya viene como texto JSON limpio sin bloques markdown
            return json.loads(response.text)
        except json.JSONDecodeError:
            print(f"Error decodificando la respuesta de la IA: {response.text}")
            return None

    def buscar_propiedades(self, filtros_json):
        """
        Toma el JSON extraído por la IA y construye una consulta dinámica
        basada exactamente en el modelo de base de datos de Propiedades.
        """
        # Inicializamos los filtros base con las reglas del negocio (Solo visibles y disponibles)
        filtros = Q(estado_propiedad__iexact='Disponible') & Q(publicado_movil=True)

        # 1. Filtro de Ubicación (Mapeado a la relación de la tabla Zona y textos informativos)
        ubicacion = filtros_json.get('ubicacion')
        if ubicacion:
            filtros &= (
                Q(zona__zona__icontains=ubicacion) | 
                Q(titulo__icontains=ubicacion) | 
                Q(descripcion__icontains=ubicacion)
            )

        # 2. Rango de Precios
        precio_max = filtros_json.get('precio_max')
        if precio_max:
            filtros &= Q(precio__lte=precio_max)

        precio_min = filtros_json.get('precio_min')
        if precio_min:
            filtros &= Q(precio__gte=precio_min)

        # 3. Modalidad de Operación ("Venta" o "Alquiler")
        operacion = filtros_json.get('operacion')
        if operacion:
            filtros &= Q(modalidad_operacion__iexact=operacion)

        # 4. Tipo de Inmueble ("casa", "departamento", etc.)
        tipo = filtros_json.get('tipo_propiedad')
        if tipo:
            filtros &= Q(tipo_inmueble__icontains=tipo)

        # Retornamos las propiedades filtradas optimizando las búsquedas con select_related
        return Propiedad.objects.filter(filtros).select_related('zona', 'moneda').prefetch_related('imagenes')