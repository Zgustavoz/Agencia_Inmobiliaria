from django.core.management.base import BaseCommand
from modulo_administracion_configuracion.models import Moneda

class Command(BaseCommand):
    help = 'Carga monedas iniciales'

    def handle(self, *args, **kwargs):
        monedas = [
            {'codigo': 'BS', 'nombre': 'Bolivianos', 'simbolo': 'Bs', 'estado': True},
            {'codigo': 'USD', 'nombre': 'Dólares', 'simbolo': '$', 'estado': True},
        ]

        for moneda_data in monedas:
            obj, created = Moneda.objects.get_or_create(
                codigo=moneda_data['codigo'],
                defaults=moneda_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Moneda creada: {obj.nombre}"))
            else:
                self.stdout.write(f"La moneda {obj.nombre} ya existe.")