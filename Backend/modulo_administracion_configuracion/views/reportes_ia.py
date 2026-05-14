import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from ..services.generador_reportes_ia import procesar_audio_admin, generar_archivo_fisico

# Importar modelos según se necesite
from gestion_usuarios.models.usuario import Usuario

@csrf_exempt # Para evitar problemas de tokens al grabar por JS temporalmente
def recibir_audio_reporte(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        audio_file = request.FILES['audio']
        # 2. Validación de formato: Asegurar que tenga una extensión de audio válida
        nombre_original = audio_file.name
        if not nombre_original.endswith(('.webm', '.mp3', '.wav', '.m4a', '.ogg')):
            nombre_original += '.webm' # Forzamos .webm como fallback seguro
            
        # 3. Guardar el audio temporalmente en el servidor
        fs = FileSystemStorage()
        nombre_archivo = fs.save(nombre_original, audio_file)
        ruta_completa = fs.path(nombre_archivo)
        
        # 4. Mandar el archivo a procesar con Gemini
        parametros = procesar_audio_admin(ruta_completa)
        
        # 5. Limpieza: Borrar el audio temporal local (es vital hacerlo antes de los return)
        if os.path.exists(ruta_completa):
            os.remove(ruta_completa)
        
        # 6. Evaluar la respuesta del modelo de IA
        if not parametros:
            return JsonResponse({"error": "Fallo en el procesamiento de la IA o no se entendió el audio."}, status=400)
            
        # 7. Lógica de generación de reporte (Basado en el JSON estricto que retorna la IA)
        # 2. Generar el reporte real (PDF/Excel) basado en lo que dijo la IA
        try:
            # Esta función debe devolver la ruta relativa (ej: 'reportes/archivo.pdf')
            ruta_relativa_reporte = generar_archivo_fisico(parametros)
            
            # Convertimos la ruta en una URL absoluta para el navegador
            url_descarga = request.build_absolute_uri(f"/media/{ruta_relativa_reporte}")
            
            return JsonResponse({
                "mensaje": "Reporte generado con éxito",
                "ia_detecto": parametros,
                "url_descarga": url_descarga 
            })
        except Exception as e:
            print(f"Error generando archivo: {e}")
            return JsonResponse({"error": "Error al crear el archivo del reporte."}, status=500)
            
    return JsonResponse({"error": "Petición inválida"}, status=400)