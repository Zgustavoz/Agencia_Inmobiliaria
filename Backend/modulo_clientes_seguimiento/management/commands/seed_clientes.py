from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from gestion_usuarios.models import Rol, Usuario
from modulo_clientes_seguimiento.models import (
    Cliente,
    ClienteAgente,
    ClienteInteraccion,
    ClienteOportunidad,
    ClienteRecordatorio,
)


class Command(BaseCommand):
    help = "Carga datos de prueba para clientes y sus agentes"

    DEFAULT_PASSWORD = "Agente123#"

    @transaction.atomic
    def handle(self, *args, **kwargs):
        rol_agente = self._obtener_o_crear_rol_agente()
        usuarios_base = self._crear_usuarios_base()
        agentes = self._crear_agentes(rol_agente)
        resultado = self._crear_clientes(usuarios_base, agentes)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Seed de clientes ejecutado correctamente"))
        self.stdout.write(f"  Usuarios base listos: {len(usuarios_base)}")
        self.stdout.write(f"  Agentes listos: {len(agentes)}")
        self.stdout.write(f"  Clientes procesados: {resultado['clientes']}")
        self.stdout.write(f"  Interacciones procesadas: {resultado['interacciones']}")
        self.stdout.write(f"  Oportunidades procesadas: {resultado['oportunidades']}")
        self.stdout.write(f"  Recordatorios procesados: {resultado['recordatorios']}")

    def _obtener_o_crear_rol_agente(self):
        rol_agente, creado = Rol.objects.get_or_create(
            nombre="Agente",
            defaults={
                "descripcion": "Gestion de clientes y seguimiento comercial",
            },
        )
        mensaje = "  Rol Agente creado" if creado else "  Rol Agente ya existe"
        self.stdout.write(mensaje)
        return rol_agente

    def _crear_usuarios_base(self):
        usuarios_data = [
            {
                "username": "coordinador.crm",
                "email": "coordinador.crm@inmobiliaria.com",
                "password": self.DEFAULT_PASSWORD,
                "nombres": "Carla",
                "apellidos": "Mendoza",
                "telefono": "70010001",
                "ci": "4567890 LP",
                "direccion": "Zona Sur, La Paz",
                "ocupacion": "Coordinadora Comercial",
            },
            {
                "username": "recepcion.ventas",
                "email": "recepcion.ventas@inmobiliaria.com",
                "password": self.DEFAULT_PASSWORD,
                "nombres": "Luis",
                "apellidos": "Quispe",
                "telefono": "70010002",
                "ci": "5678901 CB",
                "direccion": "Av. Blanco Galindo, Cochabamba",
                "ocupacion": "Recepcionista de Ventas",
            },
        ]

        usuarios = []
        for data in usuarios_data:
            usuario, creado = Usuario.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "nombres": data["nombres"],
                    "apellidos": data["apellidos"],
                    "telefono": data["telefono"],
                    "ci": data["ci"],
                    "direccion": data["direccion"],
                    "ocupacion": data["ocupacion"],
                    "estado": True,
                },
            )
            if creado:
                usuario.set_password(data["password"])
                usuario.save(update_fields=["password"])
            usuarios.append(usuario)

        self.stdout.write(f"  Usuarios base listos: {len(usuarios)}")
        return usuarios

    def _crear_agentes(self, rol_agente):
        agentes_data = [
            {
                "username": "agente.sofia",
                "email": "sofia.rojas@inmobiliaria.com",
                "nombres": "Sofia",
                "apellidos": "Rojas",
                "telefono": "71000011",
                "ci": "6123456 LP",
                "direccion": "Calacoto, La Paz",
            },
            {
                "username": "agente.mateo",
                "email": "mateo.vargas@inmobiliaria.com",
                "nombres": "Mateo",
                "apellidos": "Vargas",
                "telefono": "71000012",
                "ci": "7123456 SC",
                "direccion": "Equipetrol, Santa Cruz",
            },
            {
                "username": "agente.valeria",
                "email": "valeria.ortiz@inmobiliaria.com",
                "nombres": "Valeria",
                "apellidos": "Ortiz",
                "telefono": "71000013",
                "ci": "8123456 CB",
                "direccion": "Queru Queru, Cochabamba",
            },
        ]

        agentes = []
        for data in agentes_data:
            agente, creado = Usuario.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "nombres": data["nombres"],
                    "apellidos": data["apellidos"],
                    "telefono": data["telefono"],
                    "ci": data["ci"],
                    "direccion": data["direccion"],
                    "ocupacion": "Agente Inmobiliario",
                    "estado": True,
                },
            )
            if creado:
                agente.set_password(self.DEFAULT_PASSWORD)
                agente.save(update_fields=["password"])

            agente.roles.add(rol_agente)
            agentes.append(agente)

        self.stdout.write(f"  Agentes listos: {len(agentes)}")
        return agentes

    def _crear_clientes(self, usuarios_base, agentes):
        ahora = timezone.now()
        clientes_data = [
            {
                "nro_documento": "9100001",
                "tipo_documento": "CI",
                "nombres": "Andrea",
                "apellidos": "Salazar",
                "email": "andrea.salazar@gmail.com",
                "telefono": "72010001",
                "whatsapp": "72010001",
                "direccion": "Achumani, La Paz",
                "ocupacion": "Arquitecta",
                "origen": "web",
                "estado": "nuevo",
                "observaciones": "Busca departamento de 3 dormitorios con parqueo.",
                "creado_por": usuarios_base[0],
                "agente": agentes[0],
                "interacciones": [
                    {
                        "tipo": "consulta",
                        "asunto": "Consulta inicial por departamento familiar",
                        "detalle": "Solicito informacion sobre departamentos con 3 dormitorios en zona sur.",
                        "proxima_accion": "Enviar opciones filtradas por presupuesto",
                        "fecha_proxima_accion": ahora + timedelta(days=1),
                    },
                    {
                        "tipo": "whatsapp",
                        "asunto": "Seguimiento de opciones enviadas",
                        "detalle": "Confirmo interes en dos propiedades con parqueo y baulera.",
                        "proxima_accion": "Coordinar visita presencial",
                        "fecha_proxima_accion": ahora + timedelta(days=3),
                    },
                ],
                "oportunidad": {
                    "nombre": "Compra departamento familiar - Andrea Salazar",
                    "descripcion": "Prospecto interesado en compra de departamento entre 120000 y 150000 USD.",
                    "etapa": "prospecto",
                    "valor_estimado": "135000.00",
                    "probabilidad": "35.00",
                    "fecha_cierre_est": (ahora + timedelta(days=25)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Llamar para confirmar visita",
                        "descripcion": "Confirmar disponibilidad para visitar propiedades el fin de semana.",
                        "fecha_recordatorio": ahora + timedelta(days=2),
                        "atendido": False,
                    },
                ],
            },
            {
                "nro_documento": "9100002",
                "tipo_documento": "CI",
                "nombres": "Javier",
                "apellidos": "Peñaranda",
                "email": "javier.penaranda@gmail.com",
                "telefono": "72010002",
                "whatsapp": "72010002",
                "direccion": "Sopocachi, La Paz",
                "ocupacion": "Contador",
                "origen": "referido",
                "estado": "seguimiento",
                "observaciones": "Interesado en casa familiar con patio amplio.",
                "creado_por": usuarios_base[1],
                "agente": agentes[1],
                "interacciones": [
                    {
                        "tipo": "llamada",
                        "asunto": "Levantamiento de requerimiento de vivienda",
                        "detalle": "Busca casa con 4 dormitorios, patio y acceso rapido al centro.",
                        "proxima_accion": "Preparar cartera de casas en oferta",
                        "fecha_proxima_accion": ahora + timedelta(days=2),
                    },
                    {
                        "tipo": "visita",
                        "asunto": "Visita a casa en Achocalla",
                        "detalle": "La propiedad gusto por el patio, pero el cliente pide revisar financiamiento.",
                        "proxima_accion": "Enviar simulacion de credito",
                        "fecha_proxima_accion": ahora + timedelta(days=4),
                    },
                ],
                "oportunidad": {
                    "nombre": "Compra casa familiar - Javier Penaranda",
                    "descripcion": "Cliente en seguimiento activo por casa con patio amplio y financiamiento bancario.",
                    "etapa": "interesado",
                    "valor_estimado": "185000.00",
                    "probabilidad": "55.00",
                    "fecha_cierre_est": (ahora + timedelta(days=18)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Enviar simulacion bancaria",
                        "descripcion": "Mandar comparativa de cuotas con dos entidades financieras.",
                        "fecha_recordatorio": ahora + timedelta(days=1, hours=4),
                        "atendido": False,
                    },
                ],
            },
            {
                "nro_documento": "9100003",
                "tipo_documento": "CI",
                "nombres": "Camila",
                "apellidos": "Flores",
                "email": "camila.flores@gmail.com",
                "telefono": "72010003",
                "whatsapp": "72010003",
                "direccion": "Tiquipaya, Cochabamba",
                "ocupacion": "Medica",
                "origen": "campana",
                "estado": "activo",
                "observaciones": "Quiere invertir en un terreno para desarrollo.",
                "creado_por": usuarios_base[0],
                "agente": agentes[2],
                "interacciones": [
                    {
                        "tipo": "email",
                        "asunto": "Presentacion de lotes para inversion",
                        "detalle": "Se enviaron opciones de terrenos con alto potencial de valorizacion.",
                        "proxima_accion": "Agendar reunion para revisar retorno esperado",
                        "fecha_proxima_accion": ahora + timedelta(days=5),
                    },
                ],
                "oportunidad": {
                    "nombre": "Inversion en terreno - Camila Flores",
                    "descripcion": "Oportunidad avanzada para compra de terreno orientado a desarrollo inmobiliario.",
                    "etapa": "negociacion",
                    "valor_estimado": "260000.00",
                    "probabilidad": "72.00",
                    "fecha_cierre_est": (ahora + timedelta(days=12)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Reunion de negociacion",
                        "descripcion": "Revisar contrapropuesta y tiempos de cierre con la cliente.",
                        "fecha_recordatorio": ahora + timedelta(days=3, hours=2),
                        "atendido": False,
                    },
                ],
            },
            {
                "nro_documento": "9100004",
                "tipo_documento": "Pasaporte",
                "nombres": "Sebastian",
                "apellidos": "Gutierrez",
                "email": "sebastian.gutierrez@gmail.com",
                "telefono": "72010004",
                "whatsapp": "72010004",
                "direccion": "Urubo, Santa Cruz",
                "ocupacion": "Ingeniero de Software",
                "origen": "movil",
                "estado": "seguimiento",
                "observaciones": "Busca departamento amoblado para mudanza inmediata.",
                "creado_por": usuarios_base[1],
                "agente": agentes[1],
                "interacciones": [
                    {
                        "tipo": "mensaje",
                        "asunto": "Consulta por alquiler temporal",
                        "detalle": "Necesita mudarse en menos de dos semanas a un departamento amoblado.",
                        "proxima_accion": "Compartir inventario de opciones listas para entrega",
                        "fecha_proxima_accion": ahora + timedelta(days=1),
                    },
                ],
                "oportunidad": {
                    "nombre": "Alquiler departamento amoblado - Sebastian Gutierrez",
                    "descripcion": "Busqueda urgente de alquiler con ingreso inmediato en Santa Cruz.",
                    "etapa": "interesado",
                    "valor_estimado": "12000.00",
                    "probabilidad": "60.00",
                    "fecha_cierre_est": (ahora + timedelta(days=8)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Enviar opciones amobladas",
                        "descripcion": "Priorizar inmuebles con contrato flexible y parqueo.",
                        "fecha_recordatorio": ahora + timedelta(hours=6),
                        "atendido": False,
                    },
                ],
            },
            {
                "nro_documento": "9100005",
                "tipo_documento": "CI",
                "nombres": "Paola",
                "apellidos": "Cespedes",
                "email": "paola.cespedes@gmail.com",
                "telefono": "72010005",
                "whatsapp": "72010005",
                "direccion": "Miraflores, La Paz",
                "ocupacion": "Abogada",
                "origen": "agente",
                "estado": "cerrado",
                "observaciones": "Cliente ya concreto la compra de una oficina.",
                "creado_por": usuarios_base[0],
                "agente": agentes[0],
                "interacciones": [
                    {
                        "tipo": "visita",
                        "asunto": "Visita final a oficina corporativa",
                        "detalle": "Se confirmo conformidad con ubicacion, parqueos y estado legal.",
                        "proxima_accion": "Preparar entrega documental",
                        "fecha_proxima_accion": ahora - timedelta(days=6),
                    },
                ],
                "oportunidad": {
                    "nombre": "Compra oficina - Paola Cespedes",
                    "descripcion": "Negocio ya cerrado con compra de oficina en zona empresarial.",
                    "etapa": "cerrado",
                    "valor_estimado": "98000.00",
                    "probabilidad": "100.00",
                    "fecha_cierre_est": (ahora - timedelta(days=5)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Hacer seguimiento postventa",
                        "descripcion": "Verificar satisfaccion y solicitar referencia comercial.",
                        "fecha_recordatorio": ahora + timedelta(days=7),
                        "atendido": False,
                    },
                ],
            },
            {
                "nro_documento": "9100006",
                "tipo_documento": "CI",
                "nombres": "Mauricio",
                "apellidos": "Lopez",
                "email": "mauricio.lopez@gmail.com",
                "telefono": "72010006",
                "whatsapp": "72010006",
                "direccion": "Sacaba, Cochabamba",
                "ocupacion": "Comerciante",
                "origen": "web",
                "estado": "inactivo",
                "observaciones": "Pauso la busqueda hasta el siguiente trimestre.",
                "creado_por": usuarios_base[1],
                "agente": agentes[2],
                "interacciones": [
                    {
                        "tipo": "llamada",
                        "asunto": "Pausa temporal de busqueda",
                        "detalle": "Cliente indico que retomara contacto despues de reorganizar presupuesto.",
                        "proxima_accion": "Retomar contacto el siguiente trimestre",
                        "fecha_proxima_accion": ahora + timedelta(days=45),
                    },
                ],
                "oportunidad": {
                    "nombre": "Compra lote comercial - Mauricio Lopez",
                    "descripcion": "Oportunidad pausada por replanificacion presupuestaria del cliente.",
                    "etapa": "perdido",
                    "valor_estimado": "75000.00",
                    "probabilidad": "10.00",
                    "fecha_cierre_est": (ahora + timedelta(days=60)).date(),
                },
                "recordatorios": [
                    {
                        "titulo": "Recontactar en nuevo trimestre",
                        "descripcion": "Consultar si reactiva interes por lotes comerciales.",
                        "fecha_recordatorio": ahora + timedelta(days=45),
                        "atendido": False,
                    },
                ],
            },
        ]

        procesados = 0
        interacciones = 0
        oportunidades = 0
        recordatorios = 0
        for data in clientes_data:
            agente = data.pop("agente")
            interacciones_data = data.pop("interacciones", [])
            oportunidad_data = data.pop("oportunidad", None)
            recordatorios_data = data.pop("recordatorios", [])
            cliente, _ = Cliente.objects.get_or_create(
                nro_documento=data["nro_documento"],
                defaults=data,
            )
            ClienteAgente.objects.get_or_create(
                cliente=cliente,
                agente=agente,
                defaults={"activo": True},
            )
            procesados += 1
            interacciones += self._crear_interacciones(cliente, agente, interacciones_data)
            oportunidades += self._crear_oportunidad(cliente, agente, oportunidad_data)
            recordatorios += self._crear_recordatorios(cliente, agente, recordatorios_data)

        return {
            "clientes": procesados,
            "interacciones": interacciones,
            "oportunidades": oportunidades,
            "recordatorios": recordatorios,
        }

    def _crear_interacciones(self, cliente, agente, interacciones_data):
        creadas = 0
        for item in interacciones_data:
            _, _ = ClienteInteraccion.objects.get_or_create(
                cliente=cliente,
                asunto=item["asunto"],
                defaults={
                    "agente": agente,
                    "tipo": item["tipo"],
                    "detalle": item["detalle"],
                    "proxima_accion": item["proxima_accion"],
                    "fecha_proxima_accion": item["fecha_proxima_accion"],
                },
            )
            creadas += 1
        return creadas

    def _crear_oportunidad(self, cliente, agente, oportunidad_data):
        if not oportunidad_data:
            return 0

        ClienteOportunidad.objects.get_or_create(
            cliente=cliente,
            nombre=oportunidad_data["nombre"],
            defaults={
                "agente": agente,
                "descripcion": oportunidad_data["descripcion"],
                "etapa": oportunidad_data["etapa"],
                "valor_estimado": oportunidad_data["valor_estimado"],
                "probabilidad": oportunidad_data["probabilidad"],
                "fecha_cierre_est": oportunidad_data["fecha_cierre_est"],
            },
        )
        return 1

    def _crear_recordatorios(self, cliente, agente, recordatorios_data):
        creados = 0
        for item in recordatorios_data:
            _, _ = ClienteRecordatorio.objects.get_or_create(
                cliente=cliente,
                titulo=item["titulo"],
                defaults={
                    "usuario": agente,
                    "descripcion": item["descripcion"],
                    "fecha_recordatorio": item["fecha_recordatorio"],
                    "atendido": item["atendido"],
                },
            )
            creados += 1
        return creados
