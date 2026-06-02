# 🎯 Notificaciones Push de Oportunidades - Guía Rápida

## ¿Qué hace?

Cuando se **crea una nueva oportunidad para un cliente**, automáticamente se **envía una notificación push** al cliente con:
- **Título**: 🎯 Nueva Oportunidad: [Nombre]
- **Body**: Se ha registrado una nueva oportunidad para ti. Etapa: [Etapa]
- **Datos**: ID de oportunidad, nombre, etapa

**Sin guardar en BD, solo notificación en tiempo real.**

---

## 📋 Requisitos

✅ Backend ejecutándose: `python manage.py runserver`  
✅ Firebase configurado en `FIREBASE_SERVICE_ACCOUNT_JSON`  
✅ Cliente debe tener FCM token guardado (se guarda al hacer login)  

---

## 🧪 Cómo Probar

### Opción 1: Via Admin Panel

1. Ve a `http://localhost:8000/admin`
2. Abre **Clientes Oportunidades**
3. Haz clic en **ADD CLIENTE OPORTUNIDAD**
4. Completa:
   - **Cliente**: Selecciona un cliente existente
   - **Nombre**: "Apartamento Pentouse Downtown"
   - **Etapa**: Selecciona una (ej: "prospecto")
   - **Descripción**: Cualquier texto
5. Haz clic en **SAVE**
6. ✅ **La notificación se envía automáticamente**

### Opción 2: Via API (con curl o Postman)

```bash
# Primero obtén un token JWT
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "tu_usuario", "password": "tu_contraseña"}'

# Copia el token (access token)

# Luego crea una oportunidad
curl -X POST http://localhost:8000/api/modulo_clientes_seguimiento/oportunidades/ \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": 1,
    "nombre": "Casa de Lujo - Madera Blanca",
    "descripcion": "Propiedad premium con vista al mar",
    "etapa": "prospecto",
    "valor_estimado": 500000,
    "probabilidad": 75
  }'
```

### Opción 3: Via Django Shell

```bash
cd Backend
python manage.py shell
```

```python
from modulo_clientes_seguimiento.models import ClienteOportunidad, Cliente

# Obtén un cliente
cliente = Cliente.objects.first()

# Crea la oportunidad
opp = ClienteOportunidad.objects.create(
    cliente=cliente,
    nombre="Inversión en Complejo Residencial",
    descripcion="Oportunidad de inversión a largo plazo",
    etapa='negociacion',
    valor_estimado=1000000,
    probabilidad=85
)

# ✅ La notificación se envía automáticamente!
```

---

## 📱 ¿Cómo Ver la Notificación?

### Mobile (Flutter)
- La notificación aparece en **bandeja de notificaciones** del dispositivo
- Si la app está abierta, aparece un diálogo/banner

### Web (React)
- Las notificaciones push funcionan en **navegadores modernos**
- Debes tener **permiso concedido** para notificaciones del navegador
- Aparecerá en la **esquina inferior derecha** del navegador

---

## 🔧 Código que se Ejecuta

**Backend**: `modulo_clientes_seguimiento/signals.py`

```python
@receiver(post_save, sender=ClienteOportunidad)
def enviar_notificacion_oportunidad(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea
        cliente_user = instance.cliente.usuario
        if cliente_user:
            FirebaseService.send_push_notification(
                user=cliente_user,
                title=f"🎯 Nueva Oportunidad: {instance.nombre}",
                body=f"Se ha registrado una nueva oportunidad para ti. Etapa: {instance.get_etapa_display()}",
                data={
                    "tipo": "oportunidad_nueva",
                    "id_oportunidad": str(instance.id),
                    "nombre": instance.nombre,
                    "etapa": instance.etapa
                }
            )
```

---

## 🐛 Debugging

Si no llega la notificación, verifica en la consola de Django:

```
DEBUG: Enviando notificación push de nueva oportunidad al usuario admin
DEBUG: Intentando enviar notificación a admin. Tokens encontrados: 1
DEBUG: Firebase response: success=1, failure=0
```

- ❌ **"Tokens encontrados: 0"** = El usuario no tiene FCM token guardado
- ❌ **"failure=1"** = Error en Firebase

---

## 📝 Endpoints disponibles

```
POST   /api/modulo_clientes_seguimiento/oportunidades/     # Crear
GET    /api/modulo_clientes_seguimiento/oportunidades/     # Listar
GET    /api/modulo_clientes_seguimiento/oportunidades/{id}/ # Detalle
PUT    /api/modulo_clientes_seguimiento/oportunidades/{id}/ # Actualizar
DELETE /api/modulo_clientes_seguimiento/oportunidades/{id}/ # Eliminar
```

---

## ✨ Resumen

| Aspecto | Descripción |
|--------|-----------|
| **Dispara cuando** | Se crea una nueva ClienteOportunidad |
| **A quién se envía** | Al usuario asociado al cliente |
| **Por qué canal** | Firebase Cloud Messaging (FCM) |
| **¿Se guarda?** | NO, solo notificación en tiempo real |
| **Información enviada** | Título, body, datos JSON |

¡**Lista para usar!** 🚀
