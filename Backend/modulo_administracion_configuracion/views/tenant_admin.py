from django.db import transaction, models as django_models
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Tenant
from ..serializers.tenant import SuperAdminTenantSerializer, TenantProvisioningSerializer
from gestion_usuarios.permissions.superadmin import IsGlobalSuperAdmin
from modulo_inmuebles.models import Propiedad
from gestion_usuarios.models import Usuario, Rol, UsuarioRol 
from ..serializers.tenant import SuperAdminTenantSerializer, TenantProvisioningSerializer, SuperAdminTenantDetailSerializer

class SuperAdminTenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para que el Superadmin gestione todos los tenants.
    Incluye estadísticas agregadas y se salta el aislamiento de tenant.
    """
    serializer_class = SuperAdminTenantSerializer
    permission_classes = [IsAuthenticated, IsGlobalSuperAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['creado_en', 'nombre', 'fecha_vencimiento_pago']

    def get_queryset(self):
        # Anotamos el queryset con los conteos de relaciones
        return Tenant.objects.annotate(
            total_propiedades=Count('propiedades', distinct=True),
            total_clientes=Count('clientes', distinct=True),
            total_usuarios=Count('usuarios', distinct=True)
        ).order_by('-creado_en')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Volvemos a anotar la instancia individual para asegurar que los conteos estén presentes
        annotated_instance = Tenant.objects.filter(pk=instance.pk).annotate(
            total_propiedades=Count('propiedades', distinct=True),
            total_clientes=Count('clientes', distinct=True),
            total_usuarios=Count('usuarios', distinct=True)
        ).first()

        serializer = SuperAdminTenantDetailSerializer(annotated_instance)
        return Response(serializer.data)


    @action(detail=False, methods=['post'])
    def provisionar(self, request):
        """
        Crea un Tenant y su Usuario Administrador en una sola transacción.
        """
        serializer = TenantProvisioningSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            with transaction.atomic():
                # 1. Crear el Tenant
                vencimiento = timezone.now().date() + timezone.timedelta(days=30)
                tenant = Tenant.objects.create(
                    nombre=data['tenant_nombre'],
                    descripcion=data.get('tenant_descripcion', ''),
                    plan=data['tenant_plan'],
                    max_propiedades=data['tenant_max_propiedades'],
                    fecha_vencimiento_pago=vencimiento,
                    estado=True
                )

                # 2. Crear el Usuario Administrador para ese Tenant
                user = Usuario.objects.create_user(
                    username=data['admin_username'],
                    email=data['admin_email'],
                    password=data['admin_password'],
                    nombres=data['admin_nombres'],
                    apellidos=data['admin_apellidos'],
                    tenant=tenant,
                    es_admin=True # Es admin de su propio sistema/tenant
                )

                # 3. Asignar el Rol 'Administrador'
                rol_admin = Rol.objects.get(nombre='Administrador')
                UsuarioRol.objects.create(usuario=user, rol=rol_admin)

                return Response({
                    "message": "Tenant y Administrador creados exitosamente",
                    "tenant_id": tenant.id,
                    "admin_id": user.id
                }, status=status.HTTP_201_CREATED)

        except Rol.DoesNotExist:
            return Response({"error": "El rol 'Administrador' no existe en el sistema."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats_globales(self, request):
        """
        Retorna estadísticas generales de todo el sistema para el Dashboard.
        """
        hoy = timezone.now().date()
        proximos_7_dias = hoy + timezone.timedelta(days=7)

        stats = {
            "tenants_activos": Tenant.objects.filter(estado=True).count(),
            "tenants_inactivos": Tenant.objects.filter(estado=False).count(),
            "total_propiedades_sistema": Propiedad.objects.count(),
            "suscripciones_por_vencer": Tenant.objects.filter(
                estado=True, 
                fecha_vencimiento_pago__range=[hoy, proximos_7_dias]
            ).count(),
            "suscripciones_vencidas": Tenant.objects.filter(
                Q(estado=False) | Q(fecha_vencimiento_pago__lt=hoy)
            ).count()
        }
        return Response(stats, status=status.HTTP_200_OK)
