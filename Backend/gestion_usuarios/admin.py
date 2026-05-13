from django.contrib import admin
from .models.usuario import Usuario, UsuarioRol
from .models.rol import Rol, RolPermiso
from .models.permiso import Permiso
from .models.agencia import Agencia
from .models.actividad_sistema import ActividadSistema
# Register your models here.

# Registro básico de tus modelos
admin.site.register(Usuario)
admin.site.register(Rol)
admin.site.register(Permiso)
admin.site.register(Agencia)
admin.site.register(ActividadSistema)
admin.site.register(RolPermiso)
admin.site.register(UsuarioRol)
