from django.core.management.base import BaseCommand
from modulo_inmuebles.models import Zona
from decimal import Decimal

class Command(BaseCommand):
    help = 'Carga zonas detalladas de Santa Cruz de la Sierra'

    def handle(self, *args, **kwargs):
        zonas_detalladas = [
            {
                'pais': 'Bolivia',
                'departamento': 'Santa Cruz',
                'provincia': 'Andrés Ibáñez',
                'municipio': 'Santa Cruz de la Sierra',
                'ciudad': 'Santa Cruz de la Sierra',
                'zona': 'Equipetrol',
                'barrio': 'Sirari',
                'referencia': 'Cerca del Colegio Alemán',
                'latitud': Decimal('-17.7611000'),
                'longitud': Decimal('-63.1925000'),
                'estado': True
            },
            {
                'pais': 'Bolivia',
                'departamento': 'Santa Cruz',
                'provincia': 'Andrés Ibáñez',
                'municipio': 'Santa Cruz de la Sierra',
                'ciudad': 'Santa Cruz de la Sierra',
                'zona': 'Urbarí',
                'barrio': 'Urbarí Central',
                'referencia': 'Por la zona del Segundo Anillo',
                'latitud': Decimal('-17.7942000'),
                'longitud': Decimal('-63.1989000'),
                'estado': True
            },
            {
                'pais': 'Bolivia',
                'departamento': 'Santa Cruz',
                'provincia': 'Warnes',
                'municipio': 'Warnes',
                'ciudad': 'Warnes',
                'zona': 'Pentaguazú',
                'barrio': 'Pentaguazú I',
                'referencia': 'Km 15 Carretera al Norte',
                'latitud': Decimal('-17.5833000'),
                'longitud': Decimal('-63.1667000'),
                'estado': True
            }
        ]

        for data in zonas_detalladas:
            # Usamos zona y barrio como identificadores únicos para evitar duplicados
            obj, created = Zona.objects.get_or_create(
                zona=data['zona'],
                barrio=data['barrio'],
                defaults=data
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Zona creada exitosamente: {obj.zona} - {obj.barrio}"))
            else:
                self.stdout.write(self.style.WARNING(f"La zona {obj.zona} ya existía en la base de datos."))

        self.stdout.write(self.style.SUCCESS("--- Proceso de carga de zonas finalizado ---"))