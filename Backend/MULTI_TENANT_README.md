# Multi-Tenant Backend - Guía Rápida

## Resumen

Este backend implementa una arquitectura multi-tenant con **esquema compartido** que garantiza el aislamiento de datos entre múltiples empresas (inquilinos). Cada petición es validada para asegurar que solo el tenant autenticado puede acceder a sus datos.

## Inicio Rápido

### 1. Ejecutar Migraciones

```bash
cd Backend
python manage.py migrate
```

Esto creará la tabla `tenants` y agregará los campos `tenant` a `usuarios`, `propiedades` y `clientes`.

### 2. Crear Tenants y Usuarios

```bash
python manage.py shell
```

```python
from modulo_administracion_configuracion.models import Tenant
from gestion_usuarios.models import Usuario
from django.utils import timezone
from datetime import timedelta

# Crear un tenant
tenant = Tenant.objects.create(
    nombre="Mi Inmobiliaria",
    plan="basico",
    max_propiedades=3,
    estado=True,
    fecha_vencimiento_pago=timezone.now().date() + timedelta(days=30)
)

# Crear un usuario para el tenant
usuario = Usuario.objects.create_user(
    username="admin@miinmobiliaria.com",
    email="admin@miinmobiliaria.com",
    password="password123",
    nombres="Admin",
    apellidos="User",
    tenant=tenant
)

print(f"✓ Tenant creado: {tenant.nombre} (ID: {tenant.id})")
print(f"✓ Usuario creado: {usuario.username} (tenant: {usuario.tenant.nombre})")
```

### 3. Loguearse

```bash
curl -X POST http://localhost:8000/gestion_usuarios/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@miinmobiliaria.com",
    "password": "password123"
  }'
```

**Respuesta**:
```json
{
  "message": "Login exitoso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "tenant_id": 1,
  "tenant": {
    "id": 1,
    "nombre": "Mi Inmobiliaria",
    "plan": "basico"
  }
}
```

### 4. Crear un Recurso (Propiedad)

```bash
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_propiedad": "PROP-001",
    "titulo": "Apartamento Céntrico",
    "id_zona": 1,
    "id_moneda": 1,
    "precio": 250000
  }'
```

**Resultado**:
- El `tenant_id` se asigna **automáticamente** al valor del usuario autenticado
- Es imposible asignar otro tenant
- Si el usuario está vencido, recibe 403 antes de poder crear

### 5. Listar Recursos

```bash
curl -X GET http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado**:
- Solo devuelve propiedades de su tenant
- Filtra automáticamente por `tenant_id`

---

## Arquitectura

### Componentes Clave

| Componente | Responsabilidad | Ubicación |
|-----------|-----------------|-----------|
| **Tenant** | Administra suscripción, plan y límites | `modulo_administracion_configuracion/models/tenant.py` |
| **Usuario** | Asociado a un tenant (1:N) | `gestion_usuarios/models/usuario.py` |
| **CookieJWTAuthentication** | Extrae y valida tenant_id de cada petición | `gestion_usuarios/authentication.py` |
| **TenantAwareViewSet** | Base de todas las vistas, filtra por tenant automáticamente | `gestion_usuarios/views/base.py` |

### Flujo de una Petición

```
Petición con JWT → Autenticación → Validación de Tenant → Filtrado en BD → Respuesta
```

Cada paso rechaza si hay anomalía (JWT inválido, tenant vencido, tenant mismatch, etc.)

---

## Cómo Expandir a Nuevos Modelos

Para que un modelo tenga multi-tenancy, solo necesitas:

### 1. Agregar el campo `tenant`

```python
# models.py
from django.db import models

class MiModelo(models.Model):
    nombre = models.CharField(max_length=100)
    tenant = models.ForeignKey(
        'modulo_administracion_configuracion.Tenant',
        on_delete=models.CASCADE
    )
```

### 2. Usar `TenantAwareViewSet` en la vista

```python
# views.py
from gestion_usuarios.views.base import TenantAwareViewSet

class MiModeloViewSet(TenantAwareViewSet):
    queryset = MiModelo.objects.all()
    serializer_class = MiModeloSerializer
```

**¡Eso es todo!** Automáticamente:
- Filtra por tenant en listados
- Valida propiedad en detalle
- Asigna tenant_id en creación
- Valida acceso cruzado

---

## Características Implementadas

### ✓ Aislamiento de Datos

- Cada tenant solo ve sus datos
- Imposible acceder a datos de otro tenant
- Validado en cada petición (no solo en frontend)

### ✓ Validación de Suscripción

- Tenant inactivo → No puede loguearse (403)
- Tenant vencido → No puede loguearse (403)
- Se valida **en el login**, no después

### ✓ Control de Planes

- Límite de propiedades por plan (ej: básico = 3)
- Se valida en **cada creación**
- Si intenta exceder: 403 Forbidden

### ✓ Seguridad

- JWT con firma criptográfica
- Header X-Tenant-ID validado contra usuario
- No se puede forzar tenant_id desde cliente
- No hay SQL injection (ORM de Django)

### ✓ Auditoría

- Cada operación está asociada a un tenant
- Fácil de investigar por tenant

---

## Seguridad: Cómo Se Previene Acceso Cruzado

### Escenario 1: Usuario intenta modificar su JWT

**¿Qué pasa?**
- Si modifica el payload, la firma no coincide
- Resultado: 401 Unauthorized

### Escenario 2: Usuario envía X-Tenant-ID: 999

**¿Qué pasa?**
- Backend valida que 999 coincida con su tenant_id real
- Si no coincide: 401 Unauthorized

### Escenario 3: Usuario intenta GET /propiedades/5 (de otro tenant)

**¿Qué pasa?**
- `get_object()` compara `propiedad.tenant_id != usuario.tenant_id`
- Si no coincide: 403 Forbidden

### Escenario 4: Usuario intenta POST /propiedades/ (sin tenant_id en payload)

**¿Qué pasa?**
- `perform_create()` asigna automáticamente `tenant_id = usuario.tenant_id`
- El cliente NO puede sobrescribir esto

---

## Debugging

Para ver el tenant actual en una petición, agrega esto a tus vistas:

```python
def list(self, request, *args, **kwargs):
    print(f"🔑 Tenant actual: {request.tenant_id}")
    print(f"🏢 Tenant objeto: {request.tenant.nombre if request.tenant else None}")
    return super().list(request, *args, **kwargs)
```

---

## Próximos Pasos

1. **Agregar a más modelos**: Extiende a `Contrato`, `ClienteOportunidad`, etc.
2. **Administración de Tenants**: Crear un panel para crear/editar tenants
3. **Reportes**: Agregarlos con filtrado por tenant
4. **Frontend**: Actualizar para enviar el token correcto

---

## Referencias

- [MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md) - Documentación completa de defensa
- [TESTING_MULTI_TENANT.md](./TESTING_MULTI_TENANT.md) - Pruebas manuales

---

## Preguntas Frecuentes

**P: ¿Qué pasa si un usuario no tiene tenant?**
R: Las vistas retornan queryset vacío. El usuario no ve nada. Es seguro.

**P: ¿Puedo tener un usuario sin tenant?**
R: Sí, `tenant` es nullable. Pero ese usuario no puede crear datos en vistas de `TenantAwareViewSet`.

**P: ¿Cómo migro datos existentes?**
R: Las nuevas FK usan `null=True` y `default=None`. Luego ejecuta un script para asignar un tenant por defecto.

**P: ¿Hay performance impact?**
R: Mínimo. El filtro es una simple cláusula WHERE. Las índices en `tenant_id` lo hacen muy rápido.

**P: ¿Funciona con superusuarios?**
R: Sí, pero respetan el mismo aislamiento. Puedes extender `TenantAwareViewSet` para darles acceso global si es necesario.

---

## Soporte

Para preguntas o reportes de seguridad, contacta al equipo de desarrollo.
