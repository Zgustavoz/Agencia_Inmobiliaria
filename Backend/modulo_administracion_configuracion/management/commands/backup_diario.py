from django.core.management.base import BaseCommand
from modulo_administracion_configuracion.views.backup import BackupManagerView

class Command(BaseCommand):
    help = 'Genera un backup automático de la base de datos'

    def handle(self, *args, **kwargs):
        self.stdout.write("Iniciando backup automático...")
        # Reutilizamos la lógica que ya hicimos en la vista
        vista = BackupManagerView()
        # Simulamos una petición (request vacío)
        class DummyRequest: pass
        
        respuesta = vista.post(DummyRequest())
        
        if 'error' in respuesta.data:
            self.stderr.write(f"Error: {respuesta.data['error']}")
        else:
            self.stdout.write(self.style.SUCCESS(f"Éxito: {respuesta.data['mensaje']}"))