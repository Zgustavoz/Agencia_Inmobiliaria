# pylint: disable=C0114,C0115,C0116,E1101
from rest_framework import serializers
from ..models.visita import Visita, HorarioDisponibilidad
from ..models.cliente import Cliente

class HorarioDisponibilidadSerializer(serializers.ModelSerializer):

    class Meta:
        model = HorarioDisponibilidad
        fields = '__all__'

class VisitaSerializer(serializers.ModelSerializer):
    propiedad_titulo = serializers.ReadOnlyField(source='propiedad.titulo')
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombres')
    agente_nombre = serializers.ReadOnlyField(source='agente.username')
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), required=False)

    class Meta:
        model = Visita
        fields = '__all__'
        read_only_fields = ('creado_en', 'actualizado_en')

    def validate(self, data):
        propiedad = data.get('propiedad')
        fecha = data.get('fecha_visita')
        h_inicio = data.get('hora_inicio')
        h_fin = data.get('hora_fin')

        if not all([propiedad, fecha, h_inicio, h_fin]):
            return data

        # Validar día de la semana (Django: 0=Lunes, 6=Domingo)
        # weekday() de python: 0=Lunes, 6=Domingo. ¡Coincide!
        dia_semana = fecha.weekday()

        # Buscar horarios disponibles para ese día y propiedad
        horarios = HorarioDisponibilidad.objects.filter(
            propiedad=propiedad,
            dia_semana=dia_semana,
            activo=True
        )

        if not horarios.exists():
            raise serializers.ValidationError(
                f"La propiedad no tiene horarios de visita configurados para el día {fecha.strftime('%A')}."
            )

        # Validar que el horario de la visita esté dentro de algún rango disponible
        esta_en_rango = False
        for h in horarios:
            if h_inicio >= h.hora_inicio and h_fin <= h.hora_fin:
                esta_en_rango = True
                break
        
        if not esta_en_rango:
            raise serializers.ValidationError(
                "El horario seleccionado no está dentro de los rangos de disponibilidad de la propiedad."
            )

        # Validar que no haya otra visita confirmada en ese mismo horario
        traslapes = Visita.objects.filter(
            propiedad=propiedad,
            fecha_visita=fecha,
            estado__in=['pendiente', 'confirmada']
        ).exclude(id_visita=self.instance.id_visita if self.instance else None)

        for v in traslapes:
            # Comprobar si hay traslape
            if (h_inicio < v.hora_fin and h_fin > v.hora_inicio):
                raise serializers.ValidationError(
                    "Ya existe una visita agendada o pendiente en este horario."
                )

        return data

    def validate_calificacion(self, value):
        if value and (value < 1 or value > 5):
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value
