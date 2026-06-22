# Resumen de Cambios: Módulo de Clientes y Gestión de Visitas

Este documento detalla las modificaciones y adiciones realizadas tanto en el Backend como en el Frontend para implementar la gestión de clientes, disponibilidad de horarios y agendamiento de visitas.

## 1. Estructura de Archivos (Nuevos y Relevantes)

```text
C:\ProyectosDjango\Agencia_Inmobiliaria\
├── Backend\
│   ├── modulo_clientes_seguimiento\ (NUEVO MÓDULO)
│   │   ├── models\
│   │   │   ├── cliente.py (Modelo Cliente con campos SQL oficiales)
│   │   │   └── visita.py  (Modelos Visita y HorarioDisponibilidad)
│   │   ├── serializers\
│   │   │   ├── cliente.py
│   │   │   └── visita.py
│   │   ├── views\
│   │   │   ├── cliente.py
│   │   │   └── visita.py
│   │   └── urls.py (Registro de endpoints: /clientes, /visitas, /horarios)
│   └── modulo_inmuebles\
│       └── models\
│           └── propiedad.py (ACTUALIZADO: 9 campos nuevos agregados)
│
└── Client\
    └── src\
        ├── App\
        │   ├── modulo-clientes-seguimiento\ (NUEVO DIRECTORIO UI)
        │   │   └── gestion-visitas\
        │   │       ├── api\ (visitaApi.js)
        │   │       └── page\ (VisitasPage.jsx, HorariosConfigPage.jsx)
        │   └── Gestion-administracion-propiedades\
        │       └── gestion-propiedad\
        │           └── components\ (PropiedadForm.jsx ACTUALIZADO)
        └── InmobiliarApp.jsx (Rutas nuevas agregadas)
```

## 2. Cambios en el Backend (Django)

### Módulo de Inmuebles (`Propiedad`)
Se sincronizó el modelo con `schema_db.md` agregando:
- `estado_propiedad` (Disponible, Reservado, etc.)
- `antiguedad_anios`, `pisos`, `comision_pct`.
- `servicios_basicos`, `caracteristicas_adicionales`.
- `publicado_movil`, `promocionada`, `fecha_publicacion`, `fecha_expiracion`.
- **Endpoints:** Filtros robustos para la App Flutter (`?publicado_movil=true`, `?estado_propiedad=Disponible`).

### Módulo de Clientes y Seguimiento (`NUEVO`)
- **Clientes:** Registro completo de datos personales y comerciales.
- **Horarios:** Tabla `propiedad_horarios_visita` para definir ventanas de tiempo (ej: Lunes 09:00-12:00).
- **Visitas:** Registro de citas con estados (pendiente, confirmada, etc.), comentarios y calificación de 1 a 5 estrellas.

## 3. Cambios en el Frontend (React)

### Gestión de Propiedades
- **Formulario Actualizado:** El `PropiedadForm.jsx` ahora permite editar todos los campos nuevos (Antigüedad, Pisos, Comisión, App Móvil, etc.) con el estilo "Skyline".
- **Lógica de Imagenes:** Se mantiene la funcionalidad de carga a Cloudinary.

### Dashboard de Seguimiento
- **Sidebar:** Nuevo menú "Seguimiento" con submenús para Visitas y Horarios.
- **Página de Visitas:** Vista de tarjetas con animaciones, visualización de calificación y acciones rápidas para confirmar o cancelar.
- **Página de Horarios:** Interfaz para seleccionar propiedades y asignarles disponibilidad semanal de forma visual.

## 4. Estado Actual de la Base de Datos
- **Migración 0003 (modulo_inmuebles):** Campos extra de propiedad.
- **Migración 0001 (modulo_clientes_seguimiento):** Tablas de clientes, visitas y horarios.

---
*Documento generado el 9 de mayo de 2026.*
