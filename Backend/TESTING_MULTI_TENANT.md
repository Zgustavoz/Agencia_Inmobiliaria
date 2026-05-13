# Pruebas de Aislamiento Multi-Tenant

## Guía Rápida de Pruebas Manuales

Ejecuta estas pruebas después de que las migraciones se hayan completado correctamente.

### Precondiciones

```bash
# 1. Ejecutar migraciones
python manage.py migrate

# 2. Crear dos tenants de prueba
python manage.py shell
```

En la shell de Django:

```python
from modulo_administracion_configuracion.models import Tenant
from gestion_usuarios.models import Usuario
from django.utils import timezone
from datetime import timedelta

# Crear Tenant 1
tenant1 = Tenant.objects.create(
    nombre="Inmobiliaria A",
    plan="basico",
    max_propiedades=3,
    estado=True,
    fecha_vencimiento_pago=timezone.now().date() + timedelta(days=30)
)

# Crear Tenant 2
tenant2 = Tenant.objects.create(
    nombre="Inmobiliaria B",
    plan="profesional",
    max_propiedades=10,
    estado=True,
    fecha_vencimiento_pago=timezone.now().date() + timedelta(days=60)
)

# Crear Usuario para Tenant 1
usuario1 = Usuario.objects.create_user(
    username="juan@inmobiliaria-a.com",
    email="juan@inmobiliaria-a.com",
    password="password123",
    nombres="Juan",
    apellidos="Pérez",
    tenant=tenant1
)

# Crear Usuario para Tenant 2
usuario2 = Usuario.objects.create_user(
    username="maria@inmobiliaria-b.com",
    email="maria@inmobiliaria-b.com",
    password="password123",
    nombres="María",
    apellidos="González",
    tenant=tenant2
)

print("✓ Precondiciones creadas")
exit()
```

---

## Test 1: Login exitoso con tenant

```bash
curl -X POST http://localhost:8000/gestion_usuarios/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "juan@inmobiliaria-a.com", "password": "password123"}' \
  -v
```

**Resultado esperado**:
```json
{
  "message": "Login exitoso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "tenant_id": 1,
  "tenant": {
    "id": 1,
    "nombre": "Inmobiliaria A",
    "plan": "basico"
  },
  "user": {...}
}
```

**¿Qué validamos?**
- El tenant_id está en la respuesta
- El JWT contiene tenant_id (puedes decodificarlo en jwt.io)

---

## Test 2: Login bloqueado si tenant está vencido

Primero vence el tenant:

```python
from modulo_administracion_configuracion.models import Tenant
from django.utils import timezone
from datetime import timedelta

tenant = Tenant.objects.get(nombre="Inmobiliaria A")
tenant.fecha_vencimiento_pago = timezone.now().date() - timedelta(days=1)
tenant.save()
```

Luego intenta login:

```bash
curl -X POST http://localhost:8000/gestion_usuarios/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "juan@inmobiliaria-a.com", "password": "password123"}' \
  -v
```

**Resultado esperado** (403):
```json
{
  "error": "Suscripción vencida, realice el pago",
  "estado": "vencido"
}
```

**¿Qué validamos?**
- El usuario vencido NO puede loguearse
- Es imposible obtener un JWT válido si el tenant está vencido

---

## Test 3: Aislamiento de datos (listar propiedades)

Primero, crea propiedades para ambos tenants:

```python
from modulo_inmuebles.models import Propiedad
from modulo_administracion_configuracion.models import Zona, Moneda
from django.utils import timezone

# Obtener zona y moneda
zona = Zona.objects.first()
moneda = Moneda.objects.first()

# Crear propiedades para Tenant 1
for i in range(2):
    Propiedad.objects.create(
        codigo_propiedad=f"PROP-A-{i+1}",
        titulo=f"Propiedad A {i+1}",
        tenant_id=1,
        id_zona=zona,
        id_moneda=moneda,
        precio=100000 + i*10000,
        creado_por=None
    )

# Crear propiedades para Tenant 2
for i in range(2):
    Propiedad.objects.create(
        codigo_propiedad=f"PROP-B-{i+1}",
        titulo=f"Propiedad B {i+1}",
        tenant_id=2,
        id_zona=zona,
        id_moneda=moneda,
        precio=200000 + i*10000,
        creado_por=None
    )
```

Luego, lista propiedades como usuario del Tenant 1:

```bash
# Obtener token de usuario 1
TOKEN_1=$(curl -X POST http://localhost:8000/gestion_usuarios/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "juan@inmobiliaria-a.com", "password": "password123"}' \
  | jq -r '.token')

# Listar propiedades
curl -X GET "http://localhost:8000/api/inmuebles/propiedades/" \
  -H "Authorization: Bearer $TOKEN_1" \
  -v
```

**Resultado esperado**:
```json
{
  "count": 2,
  "results": [
    {
      "id_propiedad": 1,
      "codigo_propiedad": "PROP-A-1",
      "titulo": "Propiedad A 1",
      "tenant_id": 1,
      ...
    },
    {
      "id_propiedad": 2,
      "codigo_propiedad": "PROP-A-2",
      "titulo": "Propiedad A 2",
      "tenant_id": 1,
      ...
    }
  ]
}
```

**¿Qué validamos?**
- Usuario 1 SOLO ve sus 2 propiedades
- NO ve las 2 propiedades del Tenant 2
- El filtro por tenant es obligatorio

---

## Test 4: Acceso denegado a ID de otro tenant

Intenta acceder al detalle de una propiedad que pertenece a otro tenant:

```bash
# Obtener ID de una propiedad del Tenant 2
PROP_ID=3  # (asumiendo que es del Tenant 2)

# Intenta acceder como usuario del Tenant 1
curl -X GET "http://localhost:8000/api/inmuebles/propiedades/$PROP_ID/" \
  -H "Authorization: Bearer $TOKEN_1" \
  -v
```

**Resultado esperado** (403):
```json
{
  "detail": "No tienes permiso para acceder a este recurso (tenant mismatch)."
}
```

**¿Qué validamos?**
- El backend valida que la propiedad pertenece al tenant correcto
- Es imposible forzar un ID de otro tenant

---

## Test 5: Restricción de límite de propiedades

El Tenant 1 tiene `max_propiedades=3`. Intenta crear la 4ª propiedad:

```bash
curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_propiedad": "PROP-A-4",
    "titulo": "Propiedad A 4",
    "id_zona": 1,
    "id_moneda": 1,
    "precio": 150000
  }' \
  -v
```

Primero crea 2 más para alcanzar el límite:

```bash
# Crea 3ª propiedad (OK)
curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Crea 4ª propiedad (debe fallar)
curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

**Resultado esperado** (403):
```json
{
  "detail": "Has alcanzado el límite de 3 propiedades para tu plan Básico. Considera actualizar tu suscripción."
}
```

**¿Qué validamos?**
- El backend cuenta propiedades del tenant
- Si alcanza el máximo, rechaza con 403
- Es imposible exceder el límite mediante fuerza bruta en la API

---

## Test 6: Asignación automática de tenant_id

Crea una propiedad y verifica que el `tenant_id` se asignó automáticamente:

```bash
curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_propiedad": "PROP-NEW",
    "titulo": "Nueva Propiedad",
    "id_zona": 1,
    "id_moneda": 1,
    "precio": 120000
  }' \
  | jq '.tenant_id'
```

**Resultado esperado**:
```
1
```

**¿Qué validamos?**
- El tenant_id es 1 (del usuario autenticado)
- Fue asignado automáticamente, no fue enviado por el cliente
- Es imposible crear una propiedad para otro tenant

---

## Test 7: No se pueden enviar datos POST sin autenticación

```bash
curl -X POST http://localhost:8000/api/inmuebles/propiedades/ \
  -H "Content-Type: application/json" \
  -d '{...}' \
  -v
```

**Resultado esperado** (401):
```json
{
  "detail": "Las credenciales de autenticación no se proporcionaron."
}
```

**¿Qué validamos?**
- Sin JWT, no se puede crear nada
- El backend requiere autenticación obligatoria

---

## Resumen de Validaciones

- ✓ **Autenticación**: Solo usuarios autenticados pueden acceder
- ✓ **Suscripción**: Usuarios vencidos no pueden loguearse
- ✓ **Aislamiento**: Cada usuario solo ve datos de su tenant
- ✓ **Acceso Denegado**: No se puede forzar un ID de otro tenant
- ✓ **Límites de Plan**: No se puede exceder el máximo de recursos
- ✓ **Asignación Automática**: El tenant_id se asigna sin intervención del cliente

---

## Logs y Debugging

Para ver qué tenant_id está activo en una petición, agrega print en las vistas:

```python
class PropiedadViewSet(TenantAwareViewSet):
    def list(self, request, *args, **kwargs):
        print(f"✓ request.tenant_id = {request.tenant_id}")
        print(f"✓ request.tenant = {request.tenant}")
        return super().list(request, *args, **kwargs)
```

Luego ejecuta una petición y observa la consola.

---

## Conclusión

Si todas estas pruebas pasan, el aislamiento multi-tenant está funcionando correctamente.
