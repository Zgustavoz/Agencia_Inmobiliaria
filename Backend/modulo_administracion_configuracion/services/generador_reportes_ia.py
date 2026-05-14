import os
import json
import pandas as pd
import google.generativeai as genai
from django.conf import settings
from django.utils import timezone
from django.conf import settings
from gestion_usuarios.models.usuario import Usuario
# Para el PDF nativo
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
def procesar_audio_admin(ruta_audio):
    """
    Envía el audio como datos inline a Gemini 2.5 Flash Lite.
    Evita el uso de File API para mayor velocidad y fiabilidad en archivos pequeños.
    """
    api_key = settings.GEMINI_API_KEY
    genai.configure(api_key=api_key, transport='rest')    
    
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    
    prompt = """
    Eres el asistente del panel de administración. Escucha el audio del administrador.
    Tu única tarea es extraer qué reporte quiere y devolver SOLO un objeto JSON estricto.
    
    Las opciones de entidad son: "usuarios", "propiedades".
    Las opciones de tiempo son: "este_mes", "historico".
    Las opciones de formato son: "pdf", "excel", "html".
    
    Si el usuario no especifica formato, asume "pdf".
    Si el usuario dice "web" o "página", asume "html".
    
    Ejemplo de salida: {"entidad": "usuarios", "tiempo": "este_mes", "formato": "pdf"}
    """
    try:
        # 1. Leemos los bytes del archivo local
        with open(ruta_audio, "rb") as f:
            audio_data = f.read()
        
        print(f"--- PROCESANDO AUDIO INLINE ({len(audio_data)} bytes) ---")

        # 2. Enviamos el audio directamente en la petición
        # Al enviarlo como 'data', Gemini lo procesa en tiempo real
        respuesta = model.generate_content([
            prompt,
            {
                "mime_type": "audio/webm",
                "data": audio_data
            }
        ], generation_config={"response_mime_type": "application/json"})
        
        print(f"IA respondió: {respuesta.text}")
        return json.loads(respuesta.text)
    
    except Exception as e:
        print(f"Error en el procesamiento inline: {e}")
        return None
    
# --- 1. EXTRACCIÓN DE DATOS ---
def obtener_datos_reporte(entidad, tiempo):
    """Encargada puramente de la base de datos"""
    if entidad == "usuarios":
        queryset = Usuario.objects.all()
        if tiempo == "este_mes":
            ahora = timezone.now()
            queryset = queryset.filter(creado_en__month=ahora.month, creado_en__year=ahora.year)
        
        columnas = ['id', 'username', 'nombres', 'apellidos', 'email', 'telefono', 'creado_en']
        data = list(queryset.values(*columnas))
        df = pd.DataFrame(data) if data else pd.DataFrame([{"Mensaje": "Sin datos"}])
        
        if not df.empty and 'creado_en' in df.columns:
            df['creado_en'] = pd.to_datetime(df['creado_en']).dt.strftime('%d/%m/%Y %H:%M')
        return df, "Reporte de Usuarios"
    
    # Aquí puedes añadir 'propiedades' siguiendo el mismo patrón
    return pd.DataFrame(), "Reporte Genérico"

# --- 2. GENERADORES DE ARCHIVOS ---

def guardar_excel(df, ruta_total):
    df.to_excel(ruta_total, index=False, engine='openpyxl')

def guardar_html(df, ruta_total, titulo):
    # Generamos un HTML básico con estilo profesional
    html_string = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #1976d2; color: white; }}
                tr:nth-child(even) {{ background-color: #f2f2f2; }}
                h1 {{ color: #1976d2; }}
            </style>
        </head>
        <body>
            <h1>{titulo}</h1>
            <p>Generado el: {timezone.now().strftime('%d/%m/%Y %H:%M')}</p>
            {df.to_html(classes='table', index=False)}
        </body>
    </html>
    """
    with open(ruta_total, "w", encoding="utf-8") as f:
        f.write(html_string)
    return html_string # Retornamos el string por si el PDF lo necesita

def guardar_pdf(df, ruta, titulo):
    # Crea un PDF nativo usando ReportLab
    doc = SimpleDocTemplate(ruta, pagesize=letter)
    styles = getSampleStyleSheet()
    elementos = []

    # Título
    elementos.append(Paragraph(titulo, styles['Title']))
    elementos.append(Spacer(1, 12))

    # Tabla de datos
    if not df.empty:
        # Convertimos DataFrame a lista de listas para ReportLab
        data = [df.columns.to_list()] + df.values.tolist()
        # Ajustamos el tamaño de la tabla para que no se salga del PDF
        t = Table(data)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.dodgerblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elementos.append(t)
    else:
        elementos.append(Paragraph("No hay datos disponibles.", styles['Normal']))

    doc.build(elementos)


def generar_archivo_fisico(parametros):
    entidad = parametros.get("entidad", "usuarios")
    formato = parametros.get("formato", "excel").lower()
    tiempo = parametros.get("tiempo", "historico")

    # Obtener datos
    df, titulo_reporte = obtener_datos_reporte(entidad, tiempo)

    # Preparar rutas
    ext_map = {"excel": "xlsx", "pdf": "pdf", "html": "html"}
    extension = ext_map.get(formato, "xlsx")
    
    nombre_archivo = f"reporte_{entidad}_{timezone.now().strftime('%H%M%S')}.{extension}"
    ruta_relativa = os.path.join('reportes', nombre_archivo)
    ruta_total = os.path.join(settings.MEDIA_ROOT, ruta_relativa)
    os.makedirs(os.path.dirname(ruta_total), exist_ok=True)

    # Delegar generación según formato
    try:
        if formato == "excel":
            guardar_excel(df, ruta_total)
        elif formato == "pdf":
            guardar_pdf(df, ruta_total, titulo_reporte)
        elif formato == "html":
            guardar_html(df, ruta_total, titulo_reporte)
        else:
            guardar_excel(df, ruta_total) # Fallback

        return ruta_relativa
    except Exception as e:
        print(f"Error crítico en generación: {e}")
        raise e