# pylint: disable=C0114,C0115,C0116
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from gestion_usuarios.models import ActividadSistema, Usuario


class Command(BaseCommand):
    help = 'Carga registros demo para la bitacora del sistema'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina los registros actuales de la bitacora antes de sembrar datos demo',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            eliminados, _ = ActividadSistema.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'  Registros eliminados: {eliminados}'))

        usuarios = self._obtener_usuarios()
        eventos = self._eventos_demo(usuarios)

        creados = 0
        ahora = timezone.now()
        for index, evento in enumerate(eventos):
            fecha_evento = ahora - timedelta(minutes=(len(eventos) - index) * 17)
            registro = ActividadSistema.objects.create(
                usuario=evento['usuario'],
                modulo=evento['modulo'],
                entidad=evento['entidad'],
                id_entidad=evento['id_entidad'],
                accion=evento['accion'],
                detalle=evento['detalle'],
                ip_origen=evento['ip_origen'],
                user_agent=evento['user_agent'],
            )
            ActividadSistema.objects.filter(pk=registro.pk).update(fecha_evento=fecha_evento)
            creados += 1

        self.stdout.write(self.style.SUCCESS('Seed de bitacora ejecutado correctamente'))
        self.stdout.write(f'  Registros creados: {creados}')

    def _obtener_usuarios(self):
        usuarios = {
            'admin': Usuario.objects.filter(username='admin').first(),
            'agente': Usuario.objects.filter(username='agente').first(),
            'cliente': Usuario.objects.filter(username='cliente').first(),
        }

        if not any(usuarios.values()):
            raise ValueError(
                "No se encontraron usuarios base. Ejecuta primero 'python manage.py seed'."
            )

        fallback = next((usuario for usuario in usuarios.values() if usuario), None)
        for key, usuario in usuarios.items():
            if usuario is None:
                usuarios[key] = fallback

        return usuarios

    def _eventos_demo(self, usuarios):
        return [
            {
                'usuario': usuarios['admin'],
                'modulo': 'Seguridad',
                'entidad': 'Usuario',
                'id_entidad': usuarios['admin'].id if usuarios['admin'] else None,
                'accion': 'LOGIN',
                'detalle': 'Inicio de sesion del administrador principal.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Usuarios',
                'entidad': 'Usuario',
                'id_entidad': usuarios['agente'].id if usuarios['agente'] else None,
                'accion': 'CREATE',
                'detalle': 'Se creo un nuevo usuario agente para ventas corporativas.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Roles',
                'entidad': 'Rol',
                'id_entidad': 2,
                'accion': 'UPDATE',
                'detalle': 'Se actualizaron permisos del rol Agente.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Inmuebles',
                'entidad': 'Propiedad',
                'id_entidad': 101,
                'accion': 'CREATE',
                'detalle': 'Registro de nueva propiedad en la zona de Equipetrol.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Inmuebles',
                'entidad': 'Propiedad',
                'id_entidad': 101,
                'accion': 'UPDATE',
                'detalle': 'Se ajusto el precio de oferta de la propiedad publicada.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Clientes',
                'entidad': 'Cliente',
                'id_entidad': 15,
                'accion': 'CREATE',
                'detalle': 'Se registro un nuevo cliente interesado en alquiler temporal.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Visitas',
                'entidad': 'Visita',
                'id_entidad': 32,
                'accion': 'CREATE',
                'detalle': 'Se programo una visita para el sabado a las 10:00.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/135.0',
            },
            {
                'usuario': usuarios['cliente'],
                'modulo': 'Seguridad',
                'entidad': 'Usuario',
                'id_entidad': usuarios['cliente'].id if usuarios['cliente'] else None,
                'accion': 'LOGIN',
                'detalle': 'Inicio de sesion de cliente desde la app web.',
                'ip_origen': '200.87.118.91',
                'user_agent': 'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/135.0',
            },
            {
                'usuario': usuarios['cliente'],
                'modulo': 'Propiedades',
                'entidad': 'Favorito',
                'id_entidad': 101,
                'accion': 'CREATE',
                'detalle': 'El cliente guardo una propiedad como favorita.',
                'ip_origen': '200.87.118.91',
                'user_agent': 'Mozilla/5.0 (Linux; Android 14) Mobile Chrome/135.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Backups',
                'entidad': 'Respaldo',
                'id_entidad': 7,
                'accion': 'CREATE',
                'detalle': 'Se genero un respaldo manual de la base de datos.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Configuracion',
                'entidad': 'Tenant',
                'id_entidad': 1,
                'accion': 'UPDATE',
                'detalle': 'Se actualizo la configuracion de suscripcion del tenant principal.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Contratos',
                'entidad': 'Contrato',
                'id_entidad': 12,
                'accion': 'CREATE',
                'detalle': 'Se registro un nuevo contrato de alquiler por 12 meses.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (X11; Linux x86_64) Firefox/138.0',
            },
            {
                'usuario': usuarios['agente'],
                'modulo': 'Contratos',
                'entidad': 'PagoContrato',
                'id_entidad': 44,
                'accion': 'UPDATE',
                'detalle': 'Se marco la cuota de mayo como pagada.',
                'ip_origen': '186.121.244.25',
                'user_agent': 'Mozilla/5.0 (X11; Linux x86_64) Firefox/138.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Usuarios',
                'entidad': 'Usuario',
                'id_entidad': usuarios['cliente'].id if usuarios['cliente'] else None,
                'accion': 'CAMBIAR_ESTADO',
                'detalle': 'Se reactivó la cuenta de un cliente despues de validacion manual.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
            {
                'usuario': usuarios['admin'],
                'modulo': 'Seguridad',
                'entidad': 'Usuario',
                'id_entidad': usuarios['admin'].id if usuarios['admin'] else None,
                'accion': 'LOGOUT',
                'detalle': 'Cierre de sesion del administrador principal.',
                'ip_origen': '190.129.15.10',
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0',
            },
        ]
