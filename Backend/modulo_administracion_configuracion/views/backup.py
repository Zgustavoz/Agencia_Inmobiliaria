import os
import subprocess
import boto3
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Importamos tu nuevo modelo
from ..models import BackupCloud 

# Carpeta temporal (solo vivirá unos segundos mientras se sube/descarga)
TEMP_BACKUP_DIR = os.path.join(settings.BASE_DIR, 'TempBackups')

def get_r2_client():
    """Función de ayuda para conectar con Cloudflare R2"""
    return boto3.client(
        's3',
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    )

class BackupManagerView(APIView):
    # permission_classes = [IsAdminUser] 

    def get(self, request):
        """Lista todos los backups desde la Base de Datos (Ya no lee carpetas locales)"""
        backups = BackupCloud.objects.all()
        archivos = []
        
        for b in backups:
            archivos.append({
                "nombre": b.nombre,
                "tamaño_mb": b.tamano, # Mantenemos la llave igual para tu Frontend
                "fecha": b.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
                "url": b.url
            })
            
        return Response({"backups": archivos})

    def post(self, request):
        """Crea el backup, lo sube a R2 y guarda el registro en la Base de Datos"""
        if not os.path.exists(TEMP_BACKUP_DIR):
            os.makedirs(TEMP_BACKUP_DIR)

        db = settings.DATABASES['default']
        fecha = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"backup_{db['NAME']}_{fecha}.sql"
        file_path = os.path.join(TEMP_BACKUP_DIR, filename)

        env = os.environ.copy()
        env['PGPASSWORD'] = str(db['PASSWORD'])

        comando = [
            'pg_dump', '-h', str(db.get('HOST', 'localhost')), '-U', str(db['USER']), 
            '-d', str(db['NAME']), '-f', file_path, '--clean'
        ]

        try:
            # 1. Generar el backup en la carpeta temporal
            subprocess.run(comando, check=True, env=env)
            
            # 2. Subir el archivo a Cloudflare R2
            s3 = get_r2_client()
            s3.upload_file(file_path, settings.R2_BUCKET_NAME, filename)
            
            # 3. Calcular tamaño y armar URL de referencia
            tamaño_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
            url_referencia = f"{settings.R2_ENDPOINT_URL}/{settings.R2_BUCKET_NAME}/{filename}"

            # 4. Guardar en PostgreSQL
            BackupCloud.objects.create(
                nombre=filename,
                url=url_referencia,
                key_r2=filename,
                tamano=tamaño_mb
            )

            # 5. ¡Importante! Borrar el archivo temporal para no llenar el servidor de Render
            os.remove(file_path)

            return Response({"mensaje": "Backup creado y subido a R2 exitosamente", "archivo": filename})
            
        except Exception as e:
            # Si algo falla, limpiamos la basura
            if os.path.exists(file_path):
                os.remove(file_path)
            return Response({"error": str(e)}, status=500)


class RestoreBackupView(APIView):
    def post(self, request, filename):
        """Descarga el backup de R2 temporalmente y restaura la Base de Datos"""
        
        # 1. Buscar en la base de datos si el backup existe
        try:
            backup = BackupCloud.objects.get(nombre=filename)
        except BackupCloud.DoesNotExist:
            return Response({"error": "El registro del backup no existe"}, status=404)

        if not os.path.exists(TEMP_BACKUP_DIR):
            os.makedirs(TEMP_BACKUP_DIR)

        file_path = os.path.join(TEMP_BACKUP_DIR, filename)

        try:
            # 2. Descargar el archivo desde R2 al servidor local (Render)
            s3 = get_r2_client()
            s3.download_file(settings.R2_BUCKET_NAME, backup.key_r2, file_path)

            # 3. Restaurar la base de datos
            db = settings.DATABASES['default']
            env = os.environ.copy()
            env['PGPASSWORD'] = str(db['PASSWORD'])

            comando = [
                'psql', '-h', str(db.get('HOST', 'localhost')), '-U', str(db['USER']), 
                '-d', str(db['NAME']), '-f', file_path
            ]

            subprocess.run(comando, check=True, env=env)

            # 4. Limpiar el archivo descargado una vez restaurado
            os.remove(file_path)

            return Response({"mensaje": f"Base de datos restaurada correctamente desde la nube ({filename})"})
            
        except Exception as e:
            # Limpiar por si falló a medias
            if os.path.exists(file_path):
                os.remove(file_path)
            return Response({"error": f"Error al restaurar: {str(e)}"}, status=500)