# CONTEXTO DE SISTEMA: AGENCIA INMOBILIARIA
Eres el arquitecto líder del proyecto "Agencia Inmobiliaria". Tu objetivo es asegurar que el código Django (Models/Serializers) sea 100% fiel al esquema de base de datos PostgreSQL definido.

## REGLAS DE ORO
1. FUENTE DE VERDAD: El esquema SQL proporcionado es la estructura real.
2. ARQUITECTURA: Estructura modular. 
   - Lógica de datos: `models/`
   - Transformación: `serializers/`
   - Lógica de negocio: `services/`
3. CONVENCIÓN DE NOMBRES: Usar CamelCase para clases Django y snake_case para campos, respetando los nombres exactos de las tablas SQL (ej: id_propiedad, codigo_cliente).Usamos un venv en el Backend


## ESQUEMA DE BASE DE DATOS (SNAPSHOT)
Table "roles" {
  "id_rol" BIGSERIAL [pk, increment]
  "nombre" VARCHAR(50) [unique, not null]
  "descripcion" VARCHAR(255)
  "estado" BOOLEAN [not null, default: true]
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "permisos" {
  "id_permiso" BIGSERIAL [pk, increment]
  "codigo" VARCHAR(100) [unique, not null]
  "nombre" VARCHAR(100) [not null]
  "descripcion" VARCHAR(255)
}

Table "rol_permiso" {
  "id_rol" BIGINT [not null]
  "id_permiso" BIGINT [not null]

  Indexes {
    (id_rol, id_permiso) [pk]
  }
}

Table "usuarios" {
  "id_usuario" BIGSERIAL [pk, increment]
  "nombres" VARCHAR(100) [not null]
  "apellidos" VARCHAR(100) [not null]
  "email" VARCHAR(150) [unique]
  "telefono" VARCHAR(30)
  "username" VARCHAR(60) [unique, not null]
  "password_hash" TEXT [not null]
  "foto_url" TEXT
  "estado" BOOLEAN [not null, default: true]
  "ultimo_acceso" TIMESTAMP
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "usuario_rol" {
  "id_usuario" BIGINT [not null]
  "id_rol" BIGINT [not null]

  Indexes {
    (id_usuario, id_rol) [pk]
  }
}

Table "monedas" {
  "id_moneda" BIGSERIAL [pk, increment]
  "codigo" VARCHAR(10) [unique, not null]
  "nombre" VARCHAR(50) [not null]
  "simbolo" VARCHAR(10) [not null]
  "estado" BOOLEAN [not null, default: true]
}

Table "zonas" {
  "id_zona" BIGSERIAL [pk, increment]
  "pais" VARCHAR(100) [default: 'Bolivia']
  "departamento" VARCHAR(100)
  "provincia" VARCHAR(100)
  "municipio" VARCHAR(100)
  "ciudad" VARCHAR(100)
  "zona" VARCHAR(150) [not null]
  "barrio" VARCHAR(150)
  "referencia" VARCHAR(255)
  "latitud" NUMERIC(10,7)
  "longitud" NUMERIC(10,7)
  "estado" BOOLEAN [not null, default: true]
}

Table "clientes" {
  "id_cliente" BIGSERIAL [pk, increment]
  "codigo_cliente" VARCHAR(30) [unique]
  "tipo_documento" VARCHAR(30)
  "nro_documento" VARCHAR(50)
  "nombres" VARCHAR(100) [not null]
  "apellidos" VARCHAR(100) [not null]
  "fecha_nacimiento" DATE
  "email" VARCHAR(150)
  "telefono" VARCHAR(30)
  "whatsapp" VARCHAR(30)
  "direccion" VARCHAR(255)
  "ocupacion" VARCHAR(100)
  "origen" VARCHAR(50)
  "observaciones" TEXT
  "estado_cliente" VARCHAR(50)
  "creado_por" BIGINT
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "cliente_agente" {
  "id_cliente_agente" BIGSERIAL [pk, increment]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT [not null]
  "fecha_asignacion" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "activo" BOOLEAN [not null, default: true]
}

Table "cliente_interacciones" {
  "id_interaccion" BIGSERIAL [pk, increment]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "tipo_interaccion" VARCHAR(30) [not null]
  "asunto" VARCHAR(150)
  "detalle" TEXT
  "fecha_interaccion" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "proxima_accion" VARCHAR(150)
  "fecha_proxima_accion" TIMESTAMP
}

Table "cliente_recordatorios" {
  "id_recordatorio" BIGSERIAL [pk, increment]
  "id_cliente" BIGINT [not null]
  "id_usuario" BIGINT [not null]
  "titulo" VARCHAR(150) [not null]
  "descripcion" TEXT
  "fecha_recordatorio" TIMESTAMP [not null]
  "atendido" BOOLEAN [not null, default: false]
  "atendido_en" TIMESTAMP
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "cliente_oportunidades" {
  "id_oportunidad" BIGSERIAL [pk, increment]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "nombre" VARCHAR(150) [not null]
  "descripcion" TEXT
  "etapa" VARCHAR(30) [not null]
  "valor_estimado" NUMERIC(14,2)
  "probabilidad" NUMERIC(5,2)
  "fecha_cierre_estimada" DATE
  "creada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "propiedades" {
  "id_propiedad" BIGSERIAL [pk, increment]
  "codigo_propiedad" VARCHAR(30) [unique, not null]
  "titulo" VARCHAR(200) [not null]
  "descripcion" TEXT
  "tipo_inmueble" VARCHAR(255)
  "id_modalidad" BIGINT [not null]
  "estado_propiedad" VARCHAR(255)
  "id_zona" BIGINT
  "direccion" VARCHAR(255)
  "latitud" NUMERIC(10,7)
  "longitud" NUMERIC(10,7)
  "modalidad_operacion" VARCHAR(50)
  "precio" NUMERIC(14,2) [not null]
  "id_moneda" BIGINT [not null]
  "expensas" NUMERIC(14,2) [default: 0]
  "comision_pct" NUMERIC(5,2) [default: 0]
  "superficie_total_m2" NUMERIC(10,2)
  "superficie_construida_m2" NUMERIC(10,2)
  "ambientes" INTEGER [default: 0]
  "dormitorios" INTEGER [default: 0]
  "banos" INTEGER [default: 0]
  "garajes" INTEGER [default: 0]
  "antiguedad_anios" INTEGER
  "pisos" INTEGER
  "amoblado" BOOLEAN [default: false]
  "servicios_basicos" TEXT
  "caracteristicas_adicionales" TEXT
  "publicado_web" BOOLEAN [not null, default: true]
  "publicado_movil" BOOLEAN [not null, default: true]
  "destacada" BOOLEAN [not null, default: false]
  "promocionada" BOOLEAN [not null, default: false]
  "fecha_publicacion" TIMESTAMP
  "fecha_expiracion" TIMESTAMP
  "id_agente_publicador" BIGINT
  "creado_por" BIGINT
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "propiedad_imagenes" {
  "id_imagen" BIGSERIAL [pk, increment]
  "id_propiedad" BIGINT [not null]
  "url_imagen" TEXT [not null]
  "nombre_archivo" VARCHAR(255)
  "principal" BOOLEAN [not null, default: false]
  "orden_visual" INTEGER [not null, default: 1]
  "subido_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "propiedad_caracteristicas" {
  "id_caracteristica" BIGSERIAL [pk, increment]
  "id_propiedad" BIGINT [not null]
  "nombre" VARCHAR(100) [not null]
  "valor" VARCHAR(255)

  Indexes {
    (id_propiedad, nombre) [unique]
  }
}

Table "propiedad_historial" {
  "id_historial" BIGSERIAL [pk, increment]
  "id_propiedad" BIGINT [not null]
  "id_usuario" BIGINT
  "campo_modificado" VARCHAR(100)
  "valor_anterior" TEXT
  "valor_nuevo" TEXT
  "accion" VARCHAR(50) [not null]
  "observacion" TEXT
  "fecha_evento" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "propiedad_destacada" {
  "id_destacada" BIGSERIAL [pk, increment]
  "id_propiedad" BIGINT [not null]
  "fecha_inicio" TIMESTAMP [not null]
  "fecha_fin" TIMESTAMP
  "motivo" VARCHAR(255)
  "activa" BOOLEAN [not null, default: true]
}

Table "busquedas_cliente" {
  "id_busqueda" BIGSERIAL [pk, increment]
  "id_cliente" BIGINT
  "texto_busqueda" TEXT [not null]
  "filtros_json" JSONB
  "resultados_totales" INTEGER
  "realizada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "cotizaciones" {
  "id_cotizacion" BIGSERIAL [pk, increment]
  "codigo_cotizacion" VARCHAR(30) [unique, not null]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "estado_cotizacion" VARCHAR(30)
  "id_moneda" BIGINT [not null]
  "subtotal" NUMERIC(14,2) [not null, default: 0]
  "descuento" NUMERIC(14,2) [not null, default: 0]
  "total" NUMERIC(14,2) [not null, default: 0]
  "condiciones" TEXT
  "observaciones" TEXT
  "enviada_por_email" BOOLEAN [not null, default: false]
  "fecha_vencimiento" DATE
  "creada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "cotizacion_detalle" {
  "id_cotizacion_det" BIGSERIAL [pk, increment]
  "id_cotizacion" BIGINT [not null]
  "id_propiedad" BIGINT [not null]
  "precio_ofertado" NUMERIC(14,2) [not null]
  "observaciones" TEXT
}

Table "reservas_propiedad" {
  "id_reserva" BIGSERIAL [pk, increment]
  "id_propiedad" BIGINT [not null]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "fecha_inicio" TIMESTAMP [not null]
  "fecha_fin" TIMESTAMP [not null]
  "monto_reserva" NUMERIC(14,2)
  "observaciones" TEXT
  "estado" VARCHAR(30) [not null, default: 'activa']
  "creada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "operaciones_inmobiliarias" {
  "id_operacion" BIGSERIAL [pk, increment]
  "codigo_operacion" VARCHAR(30) [unique, not null]
  "tipo_operacion" VARCHAR(30) [not null]
  "id_propiedad" BIGINT [not null]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "id_cotizacion" BIGINT
  "monto_operacion" NUMERIC(14,2) [not null]
  "id_moneda" BIGINT [not null]
  "comision_monto" NUMERIC(14,2) [default: 0]
  "fecha_operacion" DATE [not null]
  "estado" VARCHAR(30) [not null, default: 'cerrada']
  "observaciones" TEXT
  "creada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "operacion_ingresos" {
  "id_ingreso" BIGSERIAL [pk, increment]
  "id_operacion" BIGINT [not null]
  "tipo_ingreso" VARCHAR(30) [not null]
  "monto" NUMERIC(14,2) [not null]
  "fecha_ingreso" DATE [not null]
  "observaciones" TEXT
}

Table "contratos" {
  "id_contrato" BIGSERIAL [pk, increment]
  "codigo_contrato" VARCHAR(30) [unique, not null]
  "id_propiedad" BIGINT [not null]
  "id_cliente" BIGINT [not null]
  "id_agente" BIGINT
  "id_operacion" BIGINT
  "id_estado_contrato" BIGINT [not null]
  "tipo_contrato" VARCHAR(30) [not null]
  "monto_contrato" NUMERIC(14,2) [not null]
  "id_moneda" BIGINT [not null]
  "fecha_inicio" DATE [not null]
  "fecha_fin" DATE
  "garantia" NUMERIC(14,2)
  "comision" NUMERIC(14,2)
  "condiciones" TEXT
  "observaciones" TEXT
  "renovacion_de" BIGINT
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "actualizado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "contrato_documentos" {
  "id_documento" BIGSERIAL [pk, increment]
  "id_contrato" BIGINT [not null]
  "nombre_documento" VARCHAR(150) [not null]
  "tipo_documento" VARCHAR(50)
  "url_archivo" TEXT [not null]
  "subido_por" BIGINT
  "subido_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "contrato_pagos" {
  "id_pago" BIGSERIAL [pk, increment]
  "id_contrato" BIGINT [not null]
  "nro_cuota" INTEGER
  "concepto" VARCHAR(100) [not null]
  "monto_programado" NUMERIC(14,2) [not null]
  "monto_pagado" NUMERIC(14,2) [default: 0]
  "saldo_pendiente" NUMERIC(14,2)
  "fecha_vencimiento" DATE [not null]
  "fecha_pago" DATE
  "estado_pago" VARCHAR(30) [not null, default: 'pendiente']
  "metodo_pago" VARCHAR(50)
  "observaciones" TEXT
  "creado_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "contrato_historial" {
  "id_contrato_hist" BIGSERIAL [pk, increment]
  "id_contrato" BIGINT [not null]
  "id_usuario" BIGINT
  "accion" VARCHAR(50) [not null]
  "detalle" TEXT
  "fecha_evento" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "notificaciones" {
  "id_notificacion" BIGSERIAL [pk, increment]
  "id_usuario" BIGINT
  "id_cliente" BIGINT
  "tipo" VARCHAR(50) [not null]
  "titulo" VARCHAR(150) [not null]
  "mensaje" TEXT [not null]
  "canal" VARCHAR(30) [not null]
  "leida" BOOLEAN [not null, default: false]
  "enviada_en" TIMESTAMP
  "creada_en" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Table "actividad_sistema" {
  "id_actividad" BIGSERIAL [pk, increment]
  "id_usuario" BIGINT
  "modulo" VARCHAR(50) [not null]
  "entidad" VARCHAR(50) [not null]
  "id_entidad" BIGINT
  "accion" VARCHAR(50) [not null]
  "detalle" TEXT
  "ip_origen" VARCHAR(50)
  "user_agent" TEXT
  "fecha_evento" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
}

Ref:"roles"."id_rol" < "rol_permiso"."id_rol" [delete: cascade]

Ref:"permisos"."id_permiso" < "rol_permiso"."id_permiso" [delete: cascade]

Ref:"usuarios"."id_usuario" < "usuario_rol"."id_usuario" [delete: cascade]

Ref:"roles"."id_rol" < "usuario_rol"."id_rol" [delete: cascade]

Ref:"usuarios"."id_usuario" < "clientes"."creado_por"

Ref:"clientes"."id_cliente" < "cliente_agente"."id_cliente" [delete: cascade]

Ref:"usuarios"."id_usuario" < "cliente_agente"."id_agente"

Ref:"clientes"."id_cliente" < "cliente_interacciones"."id_cliente" [delete: cascade]

Ref:"usuarios"."id_usuario" < "cliente_interacciones"."id_agente"

Ref:"clientes"."id_cliente" < "cliente_recordatorios"."id_cliente" [delete: cascade]

Ref:"usuarios"."id_usuario" < "cliente_recordatorios"."id_usuario"

Ref:"clientes"."id_cliente" < "cliente_oportunidades"."id_cliente" [delete: cascade]

Ref:"usuarios"."id_usuario" < "cliente_oportunidades"."id_agente"

Ref:"zonas"."id_zona" < "propiedades"."id_zona"

Ref:"monedas"."id_moneda" < "propiedades"."id_moneda"

Ref:"usuarios"."id_usuario" < "propiedades"."id_agente_publicador"

Ref:"usuarios"."id_usuario" < "propiedades"."creado_por"

Ref:"propiedades"."id_propiedad" < "propiedad_imagenes"."id_propiedad" [delete: cascade]

Ref:"propiedades"."id_propiedad" < "propiedad_caracteristicas"."id_propiedad" [delete: cascade]

Ref:"propiedades"."id_propiedad" < "propiedad_historial"."id_propiedad" [delete: cascade]

Ref:"usuarios"."id_usuario" < "propiedad_historial"."id_usuario"

Ref:"propiedades"."id_propiedad" < "propiedad_destacada"."id_propiedad" [delete: cascade]

Ref:"clientes"."id_cliente" < "busquedas_cliente"."id_cliente" [delete: cascade]

Ref:"clientes"."id_cliente" < "cotizaciones"."id_cliente"

Ref:"usuarios"."id_usuario" < "cotizaciones"."id_agente"

Ref:"monedas"."id_moneda" < "cotizaciones"."id_moneda"

Ref:"cotizaciones"."id_cotizacion" < "cotizacion_detalle"."id_cotizacion" [delete: cascade]

Ref:"propiedades"."id_propiedad" < "cotizacion_detalle"."id_propiedad"

Ref:"propiedades"."id_propiedad" < "reservas_propiedad"."id_propiedad"

Ref:"clientes"."id_cliente" < "reservas_propiedad"."id_cliente"

Ref:"usuarios"."id_usuario" < "reservas_propiedad"."id_agente"

Ref:"propiedades"."id_propiedad" < "operaciones_inmobiliarias"."id_propiedad"

Ref:"clientes"."id_cliente" < "operaciones_inmobiliarias"."id_cliente"

Ref:"usuarios"."id_usuario" < "operaciones_inmobiliarias"."id_agente"

Ref:"cotizaciones"."id_cotizacion" < "operaciones_inmobiliarias"."id_cotizacion"

Ref:"monedas"."id_moneda" < "operaciones_inmobiliarias"."id_moneda"

Ref:"operaciones_inmobiliarias"."id_operacion" < "operacion_ingresos"."id_operacion" [delete: cascade]

Ref:"propiedades"."id_propiedad" < "contratos"."id_propiedad"

Ref:"clientes"."id_cliente" < "contratos"."id_cliente"

Ref:"usuarios"."id_usuario" < "contratos"."id_agente"

Ref:"operaciones_inmobiliarias"."id_operacion" < "contratos"."id_operacion"

Ref:"monedas"."id_moneda" < "contratos"."id_moneda"

Ref:"contratos"."id_contrato" < "contratos"."renovacion_de"

Ref:"contratos"."id_contrato" < "contrato_documentos"."id_contrato" [delete: cascade]

Ref:"usuarios"."id_usuario" < "contrato_documentos"."subido_por"

Ref:"contratos"."id_contrato" < "contrato_pagos"."id_contrato" [delete: cascade]

Ref:"contratos"."id_contrato" < "contrato_historial"."id_contrato" [delete: cascade]

Ref:"usuarios"."id_usuario" < "contrato_historial"."id_usuario"

Ref:"usuarios"."id_usuario" < "notificaciones"."id_usuario"

Ref:"clientes"."id_cliente" < "notificaciones"."id_cliente"

Ref:"usuarios"."id_usuario" < "actividad_sistema"."id_usuario"
