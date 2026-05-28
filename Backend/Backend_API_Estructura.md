# Documentación de estructura y endpoints del backend

## 1. Árbol de directorios principal

Backend/
  ├─ .env
  ├─ .env.example
  ├─ .gitignore
  ├─ build.sh
  ├─ manage.py
  ├─ Procfile
  ├─ requirements.txt
  ├─ package-lock.json
  ├─ config/
  │   ├─ __init__.py
  │   ├─ asgi.py        # Define la app ASGI de Django
  │   ├─ settings.py   # Configuración general: apps, DB, auth, JWT, CORS, Cloudinary
  │   ├─ urls.py       # Rutas globales e inclusión de módulos
  │   └─ wsgi.py       # Define la app WSGI de Django
  ├─ gestion_usuarios/
  │   ├─ __init__.py
  │   ├─ admin.py
  │   ├─ apps.py
  │   ├─ authentication.py  # JWT desde cookies
  │   ├─ models/
  │   │   ├─ __init__.py
  │   │   ├─ actividad_sistema.py  # Bitácora de eventos
  │   │   ├─ permiso.py
  │   │   ├─ rol.py
  │   │   └─ usuario.py         # Usuario personalizado con roles y permisos
  │   ├─ permissions/
  │   │   ├─ __init__.py
  │   │   └─ roles.py           # Permisos de acceso por rol
  │   ├─ serializers/
  │   │   ├─ __init__.py
  │   │   ├─ actividad_sistema_serializer.py
  │   │   ├─ permiso.py
  │   │   ├─ registro.py
  │   │   ├─ rol.py
  │   │   ├─ token.py
  │   │   └─ usuario.py
  │   ├─ services/
  │   │   ├─ __init__.py
  │   │   └─ bitacora.py        # Registro de bitácora de acciones
  │   ├─ urls.py                # Router de API y rutas de auth
  │   ├─ views/
  │   │   ├─ __init__.py
  │   │   ├─ actividad_sistema.py
  │   │   ├─ auth.py
  │   │   ├─ base.py
  │   │   ├─ cloudinary.py
  │   │   ├─ permiso.py
  │   │   ├─ rol.py
  │   │   └─ usuario.py
  │   └─ tests.py
  ├─ modulo_administracion_configuracion/
  │   ├─ __init__.py
  │   ├─ admin.py
  │   ├─ apps.py
  │   ├─ models.py
  │   ├─ serializers/
  │   │   ├─ __init__.py
  │   │   └─ moneda.py
  │   ├─ services/
  │   │   ├─ __init__.py
  │   │   └─ moneda.py
  │   ├─ urls.py
  │   ├─ views.py
  │   ├─ views/
  │   │   ├─ __init__.py
  │   │   └─ moneda.py
  │   └─ tests.py
  ├─ modulo_inmuebles/
  │   ├─ __init__.py
  │   ├─ admin.py
  │   ├─ apps.py
  │   ├─ models.py
  │   ├─ models/
  │   │   ├─ __init__.py
  │   │   ├─ caracteristica.py
  │   │   ├─ imagen_propiedad.py
  │   │   ├─ propiedad.py
  │   │   └─ zona.py
  │   ├─ serializers/
  │   │   ├─ __init__.py
  │   │   ├─ propiedad.py
  │   │   └─ zona.py
  │   ├─ urls.py
  │   ├─ views.py
  │   ├─ views/
  │   │   ├─ __init__.py
  │   │   ├─ propiedad.py
  │   │   └─ zona.py
  │   └─ tests.py
  ├─ shared/
  │   ├─ __init__.py
  │   └─ services/
  │       ├─ __init__.py
  │       └─ cloudinary_service.py  # Servicio de subida y borrado de imágenes en Cloudinary

## 2. Flujo general de creación de endpoints

### 2.1. Punto de entrada global

- `config/urls.py` es la entrada principal del backend.
- Define rutas globales:
  - `admin/` → panel de Django
  - `health/` → endpoint de verificación rápida
  - `gestion_usuarios/` → incluye las rutas del módulo de usuarios y seguridad
  - `api/admin-config/` → incluye las rutas del módulo de configuración administrativa
  - `api/inmuebles/` → incluye las rutas del módulo de inmuebles

### 2.2. Router y vistas de `gestion_usuarios`

- `gestion_usuarios/urls.py` usa `DefaultRouter` para exponer:
  - `roles`
  - `permisos`
  - `usuarios`
  - `bitacora`

- Además define rutas explícitas de autenticación y utilidades:
  - `auth/login/`
  - `auth/registro/`
  - `auth/registro-agente/`
  - `auth/refresh/`
  - `auth/logout/`
  - `auth/recuperar-password/`
  - `auth/restablecer-password/<uidb64>/<token>/`
  - `upload-image/`

### 2.3. Auth y cookies JWT

- `gestion_usuarios/auth.py` contiene las clases de API:
  - `LoginView` → maneja inicio de sesión y guarda `access_token` y `refresh_token` en cookies
  - `RegistroView` → crea usuarios con `RegistroSerializer`
  - `RegistroAgenteView` → crea usuarios profesionales/agentes
  - `RefreshView` → renueva el token JWT desde `refresh_token` en cookies
  - `LogoutView` → borra cookies y marca al usuario como `offline`
  - `PasswordResetView` → genera token y envía email con enlace de recuperación
  - `RestablecerPasswordView` → valida el token y cambia la contraseña

- `gestion_usuarios/authentication.py` implementa `CookieJWTAuthentication`, que extrae el JWT de las cookies en lugar del encabezado Authorization.

### 2.4. Endpoints automáticos de `ModelViewSet`

Los `ViewSet` registrados en `gestion_usuarios/urls.py` generan automáticamente los endpoints CRUD básicos:

- `GET /gestion_usuarios/<recurso>/`
- `POST /gestion_usuarios/<recurso>/`
- `GET /gestion_usuarios/<recurso>/{id}/`
- `PUT /gestion_usuarios/<recurso>/{id}/`
- `PATCH /gestion_usuarios/<recurso>/{id}/`
- `DELETE /gestion_usuarios/<recurso>/{id}/`

#### Recursos de `gestion_usuarios`

- `roles` → `RolViewSet` (`gestion_usuarios/views/rol.py`)
  - acciones adicionales:
    - `POST /gestion_usuarios/roles/{id}/toggle_estado/`
    - `POST /gestion_usuarios/roles/{id}/asignar_permisos/`

- `permisos` → `PermisoViewSet` (`gestion_usuarios/views/permiso.py`)
  - acción adicional:
    - `POST /gestion_usuarios/permisos/{id}/toggle_estado/`

- `usuarios` → `UsuarioViewSet` (`gestion_usuarios/views/usuario.py`)
  - filtros de búsqueda por `search`, `roles[]`, `estado`, `fecha_desde`, `fecha_hasta`
  - acciones adicionales:
    - `POST /gestion_usuarios/usuarios/{id}/toggle_estado/`
    - `GET /gestion_usuarios/usuarios/me/`

- `bitacora` → `ActividadSistemaViewSet` (`gestion_usuarios/views/actividad_sistema.py`)
  - solo permite listar y ver detalle
  - `GET /gestion_usuarios/bitacora/`
  - `GET /gestion_usuarios/bitacora/{id}/`

### 2.5. Información de datos clave y serializadores

- `gestion_usuarios/models/usuario.py` define el usuario personalizado con:
  - campos básicos: `username`, `email`, `nombres`, `apellidos`, `telefono`
  - gestión de estado y roles
  - relación M2M con `Rol` a través de `UsuarioRol`
  - permisos calculados con `get_permisos()`

- `gestion_usuarios/models/rol.py` y `permiso.py` modelan roles y permisos, con M2M entre ambos.

- Los serializadores de `gestion_usuarios/serializers/` manejan la validación y creación de:
  - usuarios, registro y actualización
  - roles y permisos
  - token JWT personalizado en `token.py`

### 2.6. Módulo de configuración administrativa

- `modulo_administracion_configuracion/urls.py` expone:
  - `GET/POST /api/admin-config/monedas/`
  - `GET/PUT/PATCH/DELETE /api/admin-config/monedas/{id}/`

- `MonedaViewSet` en `modulo_administracion_configuracion/views/moneda.py` filtra por `search` y `estado`.
- `MonedaSerializer` valida los campos `codigo`, `nombre` y `simbolo`.
- `Moneda` en `models/moneda.py` define el catálogo de monedas.

### 2.7. Módulo de inmuebles

- `modulo_inmuebles/urls.py` expone:
  - `GET/POST /api/inmuebles/propiedades/`
  - `GET/PUT/PATCH/DELETE /api/inmuebles/propiedades/{id}/`
  - `GET/POST /api/inmuebles/zonas/`
  - `GET/PUT/PATCH/DELETE /api/inmuebles/zonas/{id}/`

- `PropiedadViewSet` (`modulo_inmuebles/views/propiedad.py`) permite:
  - consultas públicas
  - creación/edición solo para usuarios autenticados
  - búsqueda por `titulo` y `codigo_propiedad`
  - filtro opcional por `zona_id`

- `ZonaViewSet` (`modulo_inmuebles/views/zona.py`) devuelve zonas activas.

### 2.8. Flujo de creación de propiedad e imágenes

1. Cliente envía `POST /api/inmuebles/propiedades/` con datos de propiedad y posiblemente `imagenes_input`.
2. `PropiedadSerializer.create()` guarda la propiedad y enlaza `creado_por` y `id_agente_publicador` al usuario autenticado.
3. Cada imagen en `imagenes_input` se sube a Cloudinary mediante `shared/services/cloudinary_service.py`.
4. Se crea un registro en `modulo_inmuebles/models/imagen_propiedad.py` para cada imagen.

### 2.9. Upload de imágenes de perfil y utilidades

- `gestion_usuarios/views/cloudinary.py` define `UploadImageView`.
- Recibe archivo en `imagen` o `image` y lo sube a Cloudinary con `CloudinaryService.upload_image()`.
- Expuesto en `POST /gestion_usuarios/upload-image/`.

## 3. Resumen rápido de archivos más importantes

- `config/settings.py` → configuración del backend, DB, JWT, CORS, Cloudinary.
- `config/urls.py` → punto de entrada global y rutas principales.
- `gestion_usuarios/urls.py` → módulo central de seguridad y usuarios.
- `gestion_usuarios/views/auth.py` → login, registro, refresh, logout, recuperación de contraseña.
- `gestion_usuarios/views/usuario.py` → CRUD de usuarios, `me`, `toggle_estado`.
- `gestion_usuarios/views/rol.py` → CRUD de roles, `toggle_estado`, `asignar_permisos`.
- `gestion_usuarios/views/permiso.py` → CRUD de permisos, `toggle_estado`.
- `modulo_administracion_configuracion/views/moneda.py` → CRUD de monedas.
- `modulo_inmuebles/views/propiedad.py` → CRUD de propiedades y subida de imágenes.
- `shared/services/cloudinary_service.py` → capa de integración con Cloudinary.

---

## 4. Diagrama de flujo de endpoints

```mermaid
flowchart TD
    A[config/urls.py] --> B[gestion_usuarios/urls.py]
    A --> C[modulo_administracion_configuracion/urls.py]
    A --> D[modulo_inmuebles/urls.py]
    B --> E[RolViewSet]
    B --> F[PermisoViewSet]
    B --> G[UsuarioViewSet]
    B --> H[ActividadSistemaViewSet]
    B --> I[LoginView / RegistroView / RefreshView / LogoutView / PasswordResetView / RestablecerPasswordView / UploadImageView]
    C --> J[MonedaViewSet]
    D --> K[PropiedadViewSet]
    D --> L[ZonaViewSet]
    K --> M[PropiedadSerializer.create()]
    M --> N[CloudinaryService.upload_image()]
    I --> O[CookieJWTAuthentication]
    G --> P[UsuarioSerializer]
    E --> Q[RolSerializer]
    F --> R[PermisoSerializer]
    J --> S[MonedaSerializer]
    K --> T[PropiedadSerializer]
    L --> U[ZonaSerializer]
    N --> V[shared/services/cloudinary_service.py]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#afa,stroke:#333
    style C fill:#aaf,stroke:#333
    style D fill:#ffa,stroke:#333
    style I fill:#faa,stroke:#333
    style K fill:#fee,stroke:#333
    style J fill:#eef,stroke:#333
    style L fill:#efe,stroke:#333
    style V fill:#ccf,stroke:#333
```

Esta sección agrega una representación visual del flujo de rutas y los componentes principales usados en el backend.

---

Esta documentación refleja la estructura del backend en el proyecto actual y describe cómo se construyen los endpoints a partir de routers, vistas y serializadores.
