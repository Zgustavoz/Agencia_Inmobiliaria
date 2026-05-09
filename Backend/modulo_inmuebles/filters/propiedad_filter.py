import django_filters
from ..models.propiedad import Propiedad


class PropiedadFilter(django_filters.FilterSet):
    precio_min = django_filters.NumberFilter(
        field_name='precio',
        lookup_expr='gte'
    )

    precio_max = django_filters.NumberFilter(
        field_name='precio',
        lookup_expr='lte'
    )

    dormitorios_min = django_filters.NumberFilter(
        field_name='dormitorios',
        lookup_expr='gte'
    )

    banos_min = django_filters.NumberFilter(
        field_name='banos',
        lookup_expr='gte'
    )

    ambientes_min = django_filters.NumberFilter(
        field_name='ambientes',
        lookup_expr='gte'
    )

    garajes_min = django_filters.NumberFilter(
        field_name='garajes',
        lookup_expr='gte'
    )

    terreno_min = django_filters.NumberFilter(
        field_name='superficie_total_m2',
        lookup_expr='gte'
    )

    terreno_max = django_filters.NumberFilter(
        field_name='superficie_total_m2',
        lookup_expr='lte'
    )

    construccion_min = django_filters.NumberFilter(
        field_name='superficie_construida_m2',
        lookup_expr='gte'
    )

    construccion_max = django_filters.NumberFilter(
        field_name='superficie_construida_m2',
        lookup_expr='lte'
    )

    ciudad = django_filters.CharFilter(
        field_name='zona__ciudad',
        lookup_expr='icontains'
    )

    departamento = django_filters.CharFilter(
        field_name='zona__departamento',
        lookup_expr='icontains'
    )

    class Meta:
        model = Propiedad
        fields = [
            'tipo_inmueble',
            'id_modalidad',
            'zona',
            'moneda',
            'amoblado',
            'destacada',
            'publicado_web'
        ]