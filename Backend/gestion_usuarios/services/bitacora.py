'''from ..models.actividad_sistema import ActividadSistema

class BitacoraService:
    @staticmethod
    def registrar(request, modulo, entidad, accion, detalle, id_entidad=None):
        """
        Registra una acción en la bitácora.
        Extrae automáticamente la IP y el User-Agent del objeto 'request'.
        """
        # Obtener IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Obtener User Agent
        user_agent = request.META.get('HTTP_USER_AGENT', 'Desconocido')

        # Crear el registro
        return ActividadSistema.objects.create(
            usuario=request.user if request.user.is_authenticated else None,
            modulo=modulo,
            entidad=entidad,
            id_entidad=id_entidad,
            accion=accion,
            detalle=detalle,
            ip_origen=ip,
            user_agent=user_agent
        )
 '''   

    # gestion_usuarios/services/bitacora.py
from ..models.actividad_sistema import ActividadSistema

class BitacoraService:
    @staticmethod
    def registrar(request, modulo, entidad, accion, detalle, id_entidad=None, user=None): # <--- Agregamos user=None
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        user_agent = request.META.get('HTTP_USER_AGENT', 'Desconocido')

        # Prioridad: 
        # 1. El usuario que le pasemos manualmente (ideal para login/registro)
        # 2. El usuario que ya viene en el request (ideal para otras vistas)
        usuario_final = user if user else (request.user if request.user.is_authenticated else None)

        return ActividadSistema.objects.create(
            usuario=usuario_final, # <--- Usamos el usuario detectado
            modulo=modulo,
            entidad=entidad,
            id_entidad=id_entidad,
            accion=accion,
            detalle=detalle,
            ip_origen=ip,
            user_agent=user_agent
        )