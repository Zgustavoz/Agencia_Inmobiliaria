from datetime import date, timedelta
from decimal import Decimal
import random

from django.core.management.base import BaseCommand
from django.utils import timezone

from gestion_usuarios.models import Rol, Usuario, UsuarioRol
from modulo_administracion_configuracion.models import Moneda, Tenant
from modulo_clientes_seguimiento.models import Cliente
from modulo_contratos.models import Contrato
from modulo_contratos.models.operacion_inmobiliaria import OperacionInmobiliaria
from modulo_inmuebles.models.propiedad import Propiedad
from modulo_inmuebles.models.zona import Zona


class Command(BaseCommand):
    help = "Seed amplio para poblar reportes y estadisticas globales de SuperAdmin"

    def handle(self, *args, **options):
        rng = random.Random(20260622)
        today = timezone.now().date()

        self.stdout.write("Iniciando seed global de reportes y estadisticas...")

        moneda = self._ensure_moneda()
        zonas = self._ensure_zonas()
        rol_admin = Rol.objects.filter(nombre="Administrador").first()

        tenant_specs = [
            {
                "slug": "altiplano",
                "nombre": "Inmobiliaria Altiplano",
                "descripcion": "Tenant demo con volumen alto en La Paz",
                "plan": "empresa",
                "max_propiedades": 300,
                "estado": True,
                "fecha_vencimiento_pago": today + timedelta(days=25),
                "zona_offset": 0,
            },
            {
                "slug": "valle",
                "nombre": "Inmobiliaria Valle Verde",
                "descripcion": "Tenant demo con mezcla fuerte de ventas y alquileres",
                "plan": "profesional",
                "max_propiedades": 220,
                "estado": True,
                "fecha_vencimiento_pago": today + timedelta(days=5),
                "zona_offset": 1,
            },
            {
                "slug": "oriente",
                "nombre": "Inmobiliaria Oriente Plus",
                "descripcion": "Tenant demo con operaciones activas en Santa Cruz",
                "plan": "empresa",
                "max_propiedades": 260,
                "estado": True,
                "fecha_vencimiento_pago": today + timedelta(days=60),
                "zona_offset": 2,
            },
            {
                "slug": "sur",
                "nombre": "Inmobiliaria Sur Patrimonial",
                "descripcion": "Tenant demo con suscripcion vencida para poblar dashboard global",
                "plan": "basico",
                "max_propiedades": 120,
                "estado": False,
                "fecha_vencimiento_pago": today - timedelta(days=12),
                "zona_offset": 3,
            },
        ]

        total_propiedades = 0
        total_clientes = 0
        total_contratos = 0
        total_operaciones = 0

        for tenant_index, spec in enumerate(tenant_specs, start=1):
            self.stdout.write(
                f"[{tenant_index}/{len(tenant_specs)}] Preparando tenant {spec['nombre']}..."
            )
            tenant, _ = Tenant.objects.update_or_create(
                nombre=spec["nombre"],
                defaults={
                    "descripcion": spec["descripcion"],
                    "plan": spec["plan"],
                    "max_propiedades": spec["max_propiedades"],
                    "estado": spec["estado"],
                    "fecha_vencimiento_pago": spec["fecha_vencimiento_pago"],
                },
            )

            admin_user = self._ensure_user(
                username=f"seed_admin_{spec['slug']}",
                email=f"seed_admin_{spec['slug']}@example.com",
                nombres="Admin",
                apellidos=spec["slug"].title(),
                tenant=tenant,
                es_admin=True,
                telefono=f"70010{tenant_index:03d}",
            )
            if rol_admin:
                UsuarioRol.objects.get_or_create(usuario=admin_user, rol=rol_admin)

            agentes = [
                self._ensure_user(
                    username=f"seed_agente_{spec['slug']}_{agent_idx}",
                    email=f"seed_agente_{spec['slug']}_{agent_idx}@example.com",
                    nombres=f"Agente {agent_idx}",
                    apellidos=spec["slug"].title(),
                    tenant=tenant,
                    es_admin=False,
                    telefono=f"711{tenant_index:02d}{agent_idx:03d}",
                )
                for agent_idx in range(1, 5)
            ]

            clientes_usuario = []
            clientes_perfil = []
            for client_idx in range(1, 19):
                cliente_usuario = self._ensure_user(
                    username=f"seed_cliente_user_{spec['slug']}_{client_idx}",
                    email=f"seed_cliente_user_{spec['slug']}_{client_idx}@example.com",
                    nombres=f"Cliente{client_idx}",
                    apellidos=spec["slug"].title(),
                    tenant=tenant,
                    es_admin=False,
                    telefono=f"722{tenant_index:02d}{client_idx:03d}",
                )
                clientes_usuario.append(cliente_usuario)

                cliente_perfil = self._ensure_cliente(
                    tenant=tenant,
                    creado_por=admin_user,
                    usuario=cliente_usuario,
                    idx=client_idx,
                    slug=spec["slug"],
                    rng=rng,
                    created_at=timezone.now() - timedelta(days=(tenant_index * 14) + (client_idx * 11)),
                )
                clientes_perfil.append(cliente_perfil)
                total_clientes += 1

            propiedades = []
            for prop_idx in range(1, 25):
                zona = zonas[(prop_idx + spec["zona_offset"]) % len(zonas)]
                creador = agentes[prop_idx % len(agentes)]
                created_at = timezone.now() - timedelta(days=(tenant_index * 17) + (prop_idx * 13))
                propiedad = self._ensure_propiedad(
                    tenant=tenant,
                    zona=zona,
                    moneda=moneda,
                    creador=creador,
                    idx=prop_idx,
                    slug=spec["slug"],
                    rng=rng,
                    created_at=created_at,
                )
                propiedades.append(propiedad)
                total_propiedades += 1

            for contract_idx in range(1, 17):
                propiedad = propiedades[(contract_idx - 1) % len(propiedades)]
                cliente_usuario = clientes_usuario[(contract_idx * 2) % len(clientes_usuario)]
                agente = agentes[(contract_idx - 1) % len(agentes)]
                fecha_inicio = today - timedelta(days=contract_idx * 21 + tenant_index * 9)
                estado = self._pick_contrato_estado(contract_idx)
                fecha_fin = fecha_inicio + timedelta(days=180 + contract_idx * 6)
                if estado in {"VENCIDO", "FINALIZADO"}:
                    fecha_fin = today - timedelta(days=contract_idx)

                contrato = self._ensure_contrato(
                    propiedad=propiedad,
                    cliente=cliente_usuario,
                    agente=agente,
                    idx=contract_idx,
                    slug=spec["slug"],
                    rng=rng,
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    estado=estado,
                )
                total_contratos += 1

                operacion = self._ensure_operacion(
                    propiedad=propiedad,
                    cliente=cliente_usuario,
                    agente=agente,
                    moneda=moneda,
                    idx=contract_idx,
                    slug=spec["slug"],
                    rng=rng,
                    fecha_operacion=fecha_inicio + timedelta(days=5),
                )
                total_operaciones += 1

            self.stdout.write(
                self.style.NOTICE(
                    f"Tenant {spec['nombre']} listo: "
                    f"{len(clientes_usuario)} clientes, "
                    f"{len(propiedades)} propiedades, "
                    "16 contratos y 16 operaciones."
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Seed global completado: "
                f"{len(tenant_specs)} tenants, "
                f"{total_clientes} clientes, "
                f"{total_propiedades} propiedades, "
                f"{total_contratos} contratos y "
                f"{total_operaciones} operaciones."
            )
        )

    def _ensure_moneda(self):
        moneda, _ = Moneda.objects.get_or_create(
            codigo="BOB",
            defaults={"nombre": "Boliviano", "simbolo": "Bs", "estado": True},
        )
        if moneda.nombre != "Boliviano" or moneda.simbolo != "Bs" or not moneda.estado:
            moneda.nombre = "Boliviano"
            moneda.simbolo = "Bs"
            moneda.estado = True
            moneda.save(update_fields=["nombre", "simbolo", "estado"])
        return moneda

    def _ensure_zonas(self):
        zone_specs = [
            ("Centro Historico", "La Paz", "Murillo", "La Paz", "La Paz"),
            ("Calacoto", "La Paz", "Murillo", "La Paz", "La Paz"),
            ("Equipetrol", "Santa Cruz", "Andres Ibañez", "Santa Cruz", "Santa Cruz"),
            ("Queru Queru", "Cochabamba", "Cercado", "Cochabamba", "Cochabamba"),
            ("Las Palmas", "Santa Cruz", "Andres Ibañez", "Santa Cruz", "Santa Cruz"),
            ("Sopocachi", "La Paz", "Murillo", "La Paz", "La Paz"),
        ]

        zonas = []
        for zona_nombre, ciudad, provincia, municipio, departamento in zone_specs:
            zona, _ = Zona.objects.get_or_create(
                zona=zona_nombre,
                ciudad=ciudad,
                defaults={
                    "pais": "Bolivia",
                    "departamento": departamento,
                    "provincia": provincia,
                    "municipio": municipio,
                    "estado": True,
                },
            )
            zonas.append(zona)
        return zonas

    def _ensure_user(self, username, email, nombres, apellidos, tenant, es_admin, telefono):
        user, created = Usuario.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "nombres": nombres,
                "apellidos": apellidos,
                "tenant": tenant,
                "es_admin": es_admin,
                "estado": True,
                "telefono": telefono,
            },
        )
        if created:
            user.set_password("password123")
            user.save()
        else:
            changed = []
            if user.email != email:
                user.email = email
                changed.append("email")
            if user.nombres != nombres:
                user.nombres = nombres
                changed.append("nombres")
            if user.apellidos != apellidos:
                user.apellidos = apellidos
                changed.append("apellidos")
            if user.tenant_id != tenant.id:
                user.tenant = tenant
                changed.append("tenant")
            if user.es_admin != es_admin:
                user.es_admin = es_admin
                changed.append("es_admin")
            if user.telefono != telefono:
                user.telefono = telefono
                changed.append("telefono")
            if not user.estado:
                user.estado = True
                changed.append("estado")
            if changed:
                user.save(update_fields=changed)
        return user

    def _ensure_cliente(self, tenant, creado_por, usuario, idx, slug, rng, created_at):
        estados = ["nuevo", "seguimiento", "activo", "inactivo", "cerrado"]
        origenes = ["web", "movil", "referido", "agente", "campana"]
        cliente, created = Cliente.objects.get_or_create(
            usuario=usuario,
            defaults={
                "tenant": tenant,
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos,
                "email": usuario.email,
                "telefono": usuario.telefono,
                "whatsapp": usuario.telefono,
                "direccion": f"Avenida Demo {idx} - {slug.title()}",
                "ocupacion": ["Ingeniero", "Abogado", "Medico", "Arquitecto", "Comerciante"][idx % 5],
                "origen": origenes[idx % len(origenes)],
                "estado": estados[idx % len(estados)],
                "observaciones": f"Cliente seed {slug} #{idx}",
                "creado_por": creado_por,
            },
        )
        if not created:
            cliente.tenant = tenant
            cliente.nombres = usuario.nombres
            cliente.apellidos = usuario.apellidos
            cliente.email = usuario.email
            cliente.telefono = usuario.telefono
            cliente.whatsapp = usuario.telefono
            cliente.direccion = f"Avenida Demo {idx} - {slug.title()}"
            cliente.ocupacion = ["Ingeniero", "Abogado", "Medico", "Arquitecto", "Comerciante"][idx % 5]
            cliente.origen = origenes[idx % len(origenes)]
            cliente.estado = estados[idx % len(estados)]
            cliente.observaciones = f"Cliente seed {slug} #{idx}"
            cliente.creado_por = creado_por
            cliente.save()

        Cliente.objects.filter(pk=cliente.pk).update(
            creado_en=created_at,
            actualizado_en=created_at + timedelta(days=rng.randint(0, 20)),
        )
        cliente.refresh_from_db()
        return cliente

    def _ensure_propiedad(self, tenant, zona, moneda, creador, idx, slug, rng, created_at):
        estados = ["Disponible", "Reservada", "Vendida", "Alquilada"]
        tipos = ["Casa", "Departamento", "Terreno", "Oficina", "Local Comercial"]
        modalidades = ["Venta", "Alquiler", "Anticretico"]
        codigo = f"PROP-{slug.upper()}-{idx:03d}"

        precio = Decimal(str(95000 + idx * 3500 + rng.randint(0, 22000)))
        propiedad, created = Propiedad.objects.get_or_create(
            codigo_propiedad=codigo,
            defaults={
                "titulo": f"{tipos[idx % len(tipos)]} {slug.title()} {idx}",
                "descripcion": f"Propiedad seed para tenant {slug} con datos ricos para dashboards.",
                "tipo_inmueble": tipos[idx % len(tipos)],
                "id_modalidad": (idx % len(modalidades)) + 1,
                "modalidad_operacion": modalidades[idx % len(modalidades)],
                "zona": zona,
                "moneda": moneda,
                "tenant": tenant,
                "precio": precio,
                "expensas": Decimal(str(150 + (idx % 6) * 30)),
                "comision_pct": Decimal("3.50"),
                "superficie_total_m2": Decimal(str(75 + idx * 4)),
                "superficie_construida_m2": Decimal(str(60 + idx * 3)),
                "ambientes": 2 + (idx % 5),
                "dormitorios": 1 + (idx % 4),
                "banos": 1 + (idx % 3),
                "garajes": idx % 3,
                "antiguedad_anios": idx % 18,
                "pisos": 1 + (idx % 2),
                "amoblado": idx % 3 == 0,
                "servicios_basicos": "agua,luz,internet",
                "caracteristicas_adicionales": "balcon,seguridad,ascensor",
                "estado_propiedad": estados[idx % len(estados)],
                "publicado_web": True,
                "publicado_movil": idx % 4 != 0,
                "destacada": idx % 5 == 0,
                "promocionada": idx % 6 == 0,
                "fecha_publicacion": created_at,
                "fecha_expiracion": created_at + timedelta(days=180),
                "id_agente_publicador": creador,
                "creado_por": creador,
            },
        )
        if not created:
            propiedad.titulo = f"{tipos[idx % len(tipos)]} {slug.title()} {idx}"
            propiedad.descripcion = f"Propiedad seed para tenant {slug} con datos ricos para dashboards."
            propiedad.tipo_inmueble = tipos[idx % len(tipos)]
            propiedad.id_modalidad = (idx % len(modalidades)) + 1
            propiedad.modalidad_operacion = modalidades[idx % len(modalidades)]
            propiedad.zona = zona
            propiedad.moneda = moneda
            propiedad.tenant = tenant
            propiedad.precio = precio
            propiedad.expensas = Decimal(str(150 + (idx % 6) * 30))
            propiedad.comision_pct = Decimal("3.50")
            propiedad.superficie_total_m2 = Decimal(str(75 + idx * 4))
            propiedad.superficie_construida_m2 = Decimal(str(60 + idx * 3))
            propiedad.ambientes = 2 + (idx % 5)
            propiedad.dormitorios = 1 + (idx % 4)
            propiedad.banos = 1 + (idx % 3)
            propiedad.garajes = idx % 3
            propiedad.antiguedad_anios = idx % 18
            propiedad.pisos = 1 + (idx % 2)
            propiedad.amoblado = idx % 3 == 0
            propiedad.servicios_basicos = "agua,luz,internet"
            propiedad.caracteristicas_adicionales = "balcon,seguridad,ascensor"
            propiedad.estado_propiedad = estados[idx % len(estados)]
            propiedad.publicado_web = True
            propiedad.publicado_movil = idx % 4 != 0
            propiedad.destacada = idx % 5 == 0
            propiedad.promocionada = idx % 6 == 0
            propiedad.fecha_publicacion = created_at
            propiedad.fecha_expiracion = created_at + timedelta(days=180)
            propiedad.id_agente_publicador = creador
            propiedad.creado_por = creador
            propiedad.save()

        Propiedad.objects.filter(pk=propiedad.pk).update(
            creado_en=created_at,
            actualizado_en=created_at + timedelta(days=rng.randint(0, 45)),
        )
        propiedad.refresh_from_db()
        return propiedad

    def _pick_contrato_estado(self, idx):
        estados = ["ACTIVO", "ACTIVO", "VENCIDO", "FINALIZADO", "BORRADOR", "RENOVADO", "ANULADO"]
        return estados[idx % len(estados)]

    def _pick_tipo_operacion(self, idx):
        tipos = ["VENTA", "ALQUILER", "COMPRA", "ANTICRETICO"]
        return tipos[idx % len(tipos)]

    def _ensure_contrato(self, propiedad, cliente, agente, idx, slug, rng, fecha_inicio, fecha_fin, estado):
        codigo = f"CTR-{slug.upper()}-{idx:03d}"
        monto = Decimal(str(120000 + idx * 4800 + rng.randint(0, 30000)))
        tipo_operacion = self._pick_tipo_operacion(idx)
        contrato, created = Contrato.objects.get_or_create(
            codigo_contrato=codigo,
            defaults={
                "propiedad": propiedad,
                "cliente": cliente,
                "agente": agente,
                "tipo_operacion": tipo_operacion,
                "estado_contrato": estado,
                "monto": monto,
                "fecha_inicio": fecha_inicio,
                "fecha_fin": fecha_fin,
                "garantia": Decimal(str(1500 + idx * 120)),
                "comision": Decimal(str(3500 + idx * 160)),
                "condiciones": "Seed de contrato con plazos, garantia y comision.",
                "observaciones": f"Contrato seed {slug} #{idx}",
            },
        )
        if not created:
            contrato.propiedad = propiedad
            contrato.cliente = cliente
            contrato.agente = agente
            contrato.tipo_operacion = tipo_operacion
            contrato.estado_contrato = estado
            contrato.monto = monto
            contrato.fecha_inicio = fecha_inicio
            contrato.fecha_fin = fecha_fin
            contrato.garantia = Decimal(str(1500 + idx * 120))
            contrato.comision = Decimal(str(3500 + idx * 160))
            contrato.condiciones = "Seed de contrato con plazos, garantia y comision."
            contrato.observaciones = f"Contrato seed {slug} #{idx}"
            contrato.save()

        return contrato

    def _ensure_operacion(self, propiedad, cliente, agente, moneda, idx, slug, rng, fecha_operacion):
        codigo = f"OP-{slug.upper()}-{idx:03d}"
        estados = ["cerrada", "cerrada", "abierta", "anulada"]
        monto = Decimal(str(125000 + idx * 5200 + rng.randint(0, 35000)))
        operacion, created = OperacionInmobiliaria.objects.get_or_create(
            codigo_operacion=codigo,
            defaults={
                "tipo_operacion": self._pick_tipo_operacion(idx),
                "propiedad": propiedad,
                "cliente": cliente,
                "agente": agente,
                "monto_operacion": monto,
                "moneda": moneda,
                "comision_monto": Decimal(str(4200 + idx * 110)),
                "fecha_operacion": fecha_operacion,
                "estado": estados[idx % len(estados)],
                "observaciones": f"Operacion seed {slug} #{idx}",
            },
        )
        if not created:
            operacion.tipo_operacion = self._pick_tipo_operacion(idx)
            operacion.propiedad = propiedad
            operacion.cliente = cliente
            operacion.agente = agente
            operacion.monto_operacion = monto
            operacion.moneda = moneda
            operacion.comision_monto = Decimal(str(4200 + idx * 110))
            operacion.fecha_operacion = fecha_operacion
            operacion.estado = estados[idx % len(estados)]
            operacion.observaciones = f"Operacion seed {slug} #{idx}"
            operacion.save()

        return operacion
