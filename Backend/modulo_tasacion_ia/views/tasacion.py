# views/tasacion.py
import os
import json
import google.generativeai as genai
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models import TasacionIA
from ..serializer.tasacion import TasacionIASerializer
from django.conf import settings
import requests
from PIL import Image
from io import BytesIO
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from modulo_clientes_seguimiento.models.cliente import Cliente
import google.generativeai as genai
# Configurar Gemini (Asegúrate de tener GEMINI_API_KEY en tu .env de Django)
#genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class ChatTasacionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TasacionIASerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        try:
            # Intentamos obtener el cliente vinculado al usuario del token
            cliente = Cliente.objects.get(usuario=self.request.user)
            return TasacionIA.objects.filter(cliente=cliente)
        except Cliente.DoesNotExist:
            # Si no es un cliente (ej. es un admin puro), devolvemos lista vacía
            return TasacionIA.objects.none()

    def create(self, request, *args, **kwargs):
        # Esto nos dirá si Flutter realmente está enviando algo
        print("--- DATA CRUDA RECIBIDA ---")
        print(f"DATOS RECIBIDOS: {request.data}")
        print(f"POST Data: {request.POST}") # Aquí deberían salir los textos
        print(f"FILES Data: {request.FILES}") # Aquí deberían salir las imágenes
        try:
            cliente = Cliente.objects.get(usuario=self.request.user)
        except Cliente.DoesNotExist:
            return Response({"error": "No eres cliente"}, status=403)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"ERRORES DE VALIDACIÓN: {serializer.errors}")
            return Response(serializer.errors, status=400)
            
        # Al guardar, se sube a Cloudinary
        instance = serializer.save(cliente=cliente)
        
        # FORZAR REFRESH: Esto asegura que 'instance' tenga las URLs de Cloudinary y el texto guardado
        instance.refresh_from_db() 
        
        print(f"DEBUG DESPUES DE GUARDAR: {instance.mensaje_usuario}")

        try:
            self.procesar_con_ia(instance)
        except Exception as e:
            instance.respuesta_ia = f"Error: {str(e)}"
            instance.save()

        return Response(self.get_serializer(instance).data, status=201)

    def procesar_con_ia(self, instance):
        # 1. Obtenemos la llave desde settings (decouple ya la cargó del .env)
        api_key = settings.GEMINI_API_KEY
        
        # 2. Configuración con transporte REST (esto evita el error 404 anterior)
        genai.configure(api_key=api_key, transport='rest')# Aquí es donde la "entrenamos"
        instruccion_maestra = """
        Eres el Tasador Oficial de la 'Agencia Inmobiliaria Gabriel'. 
        Tu especialidad es el mercado inmobiliario de Santa Cruz de la Sierra, Bolivia.
        
        CONOCIMIENTO LOCAL:
        - Zonas Premium: Equipetrol, Urubó, Las Palmas. (Precios altos)
        - Zonas en Crecimiento: Zona Norte (detrás de la G77), Plan 3000, Villa Primero de Mayo.
        - Factores clave: Proximidad a centros comerciales (Ventura, Las Brisas), colegios y avenidas principales.

        REGLAS DE RESPUESTA:
        1. Analiza el texto del usuario y las imágenes adjuntas.
        2. Si ves materiales de lujo (porcelanato, granito, madera tajibo) en las fotos, sube la tasación.
        3. Responde SIEMPRE en formato JSON estricto con:
        {
            "analisis": "Tu explicación profesional aquí...",
            "precio": 150000
        }
        4. Sé profesional pero amable, usa términos como 'plusvalía', 'm2 construido' y 'ubicación estratégica'.
        """

        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-lite', 
            system_instruction=instruccion_maestra
        )
        
        # Construimos el contenido para el mensaje
        contenido_mensaje = []
        # DEBUG: Vamos a ver qué tiene el objeto en la consola de Django

        if instance.mensaje_usuario:
            contenido_mensaje.append(f"Datos del usuario: {instance.mensaje_usuario}")
        
        if instance.imagen_referencia:
            try:
                response_img = requests.get(instance.imagen_referencia.url)
                img = Image.open(BytesIO(response_img.content))
                contenido_mensaje.append(img)
            except Exception as e:
                print(f"Error cargando imagen: {e}")
        # Enviamos el mensaje

        if not contenido_mensaje:
            instance.respuesta_ia = "Por favor, escribe una descripción o adjunta una foto para que pueda ayudarte."
            instance.save()
            return # Salimos para no llamar a Gemini en vano
        
        response = model.generate_content(contenido_mensaje)
            
        # Parseamos el JSON que nos devuelve la IA
        try:
            # Limpiamos los backticks de markdown que suele poner la IA (```json ... ```)
            clean_text = response.text.strip('` \n')
            if clean_text.startswith('json'):
                clean_text = clean_text[4:]
                
            resultado_json = json.loads(clean_text)
            
            # Actualizamos la base de datos
            instance.respuesta_ia = resultado_json.get('analisis', 'Análisis completado.')
            instance.precio_estimado = resultado_json.get('precio')
            instance.save()
            
        except json.JSONDecodeError:
            # Si la IA no responde en formato JSON puro
            instance.respuesta_ia = response.text
            instance.save()