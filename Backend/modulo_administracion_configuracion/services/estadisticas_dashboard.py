from django.db.models import Count, Sum, Q
from django.utils import timezone

from modulo_inmuebles.models import Propiedad
from gestion_usuarios.models import Usuario
from modulo_contratos.models import Contrato


class EstadisticasDashboardService:

    @staticmethod
    def dashboard_tenant(tenant):
        hoy = timezone.now().date()

        # PROPIEDADES
        propiedades = Propiedad.objects.filter(tenant=tenant)

        stats_propiedades = {
            "total": propiedades.count(),
            "disponibles": propiedades.filter(estado_propiedad="Disponible").count(),
            "destacadas": propiedades.filter(destacada=True).count(),
            "promocionadas": propiedades.filter(promocionada=True).count(),
        }

        # USUARIOS (clientes/agentes)
        usuarios = Usuario.objects.filter(tenant=tenant)

        stats_usuarios = {
            "total": usuarios.count(),
            "activos": usuarios.filter(estado=True).count(),
            "nuevos_mes": usuarios.filter(
                creado_en__month=hoy.month,
                creado_en__year=hoy.year
            ).count(),
        }

        # CONTRATOS
        contratos = Contrato.objects.filter(propiedad__tenant=tenant)

        stats_contratos = {
            "total": contratos.count(),
            "activos": contratos.filter(estado_contrato="ACTIVO").count(),
            "vencidos": contratos.filter(estado_contrato="VENCIDO").count(),
            "finalizados": contratos.filter(estado_contrato="FINALIZADO").count(),
        }

        # INGRESOS
        ingresos = contratos.filter(
            estado_contrato__in=["ACTIVO", "FINALIZADO"]
        ).aggregate(
            total_ingresos=Sum("monto"),
            total_comisiones=Sum("comision")
        )

        return {
            "propiedades": stats_propiedades,
            "usuarios": stats_usuarios,
            "contratos": stats_contratos,
            "finanzas": ingresos
        }