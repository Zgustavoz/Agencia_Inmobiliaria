# 🗺️ Implementación de Mapa MapBox - Guía de Integración

## ✅ Lo que hemos completado

### 1. **Instalación de Dependencias**
- ✅ `mapbox-gl` instalado en el proyecto Cliente

### 2. **Componentes Creados**

#### 📦 Estructura de carpetas
```
src/shared/map/
├── components/
│   ├── MapContainer.jsx          # Componente reutilizable del mapa
│   ├── MapContainer.css          # Estilos del contenedor
│   ├── PropertyMapExample.jsx     # Ejemplo con propiedades mockeadas
│   └── PropertyMapExample.css     # Estilos del ejemplo
├── hooks/
│   └── useMap.js                 # Hook personalizado
├── index.js                      # Exportaciones
└── README.md                     # Documentación detallada

src/config/
└── mapbox.js                    # Configuración de token

src/App/Gestion-administracion-propiedades/
└── gestion-propiedad/page/
    ├── MapPage.jsx              # Página de ejemplo completa
    └── MapPage.css              # Estilos de la página
```

### 3. **Características Implementadas**

✨ **MapContainer Component:**
- Inicialización automática del mapa
- Ref forwarding para acceso a métodos de MapBox
- Controles nativos (navegación, escala, geolocalización)
- Event handlers (onLoad, onMapClick)
- Control de ciclo de vida completo

✨ **useMap Hook:**
- `flyToLocation()` - Navegación animada
- `addMarker()` - Agregar marcadores customizables
- `addPopup()` - Crear popups con información
- `centerMap()` - Centrar mapa en coordenadas
- `zoomTo()` - Cambiar nivel de zoom

✨ **PropertyMapExample:**
- 6 propiedades mockeadas para pruebas
- Marcadores interactivos con información
- Popups automáticos al hacer click
- Estructura lista para integración con API

✨ **MapPage:**
- Página de ejemplo funcional
- Documentación visual de controles
- Panel lateral con información del mapa
- Responsivo para móviles

## 🚀 Próximos Pasos

### Fase 1: Visualizar Propiedades (Actual)
✅ Mapa base completado
⏳ Integrar con datos mock
⏳ Conectar con API de propiedades

### Fase 2: Rutas y PostGIS
- Implementar cálculo de rutas entre puntos
- Integrar PostGIS para consultas geoespaciales
- Mostrar distancias y tiempos

### Fase 3: Tags y Filtros
- Agregar categorización de propiedades
- Sistema de filtrado por precio, tipo, etc.
- Clusters de propiedades para zoom lejano

## 📝 Cómo Usar el Componente

### Opción 1: Mapa Simple (Recomendado para comenzar)

```jsx
import { MapContainer } from '../../shared/map'
import { useRef } from 'react'

export default function MyMap() {
  const mapRef = useRef(null)

  return (
    <MapContainer
      ref={mapRef}
      center={[-78.5149, -0.3522]}
      zoom={5}
    />
  )
}
```

### Opción 2: Con Propiedades Mockeadas (Para pruebas)

```jsx
import { PropertyMapExample } from '../../shared/map'

export default function MapPage() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <PropertyMapExample />
    </div>
  )
}
```

### Opción 3: Con Hook Avanzado

```jsx
import { MapContainer, useMap } from '../../shared/map'
import { useRef, useEffect } from 'react'

export default function AdvancedMap() {
  const { mapRef, flyToLocation, addMarker } = useMap()

  useEffect(() => {
    if (mapRef.current) {
      addMarker([-78.5149, -0.3522], { color: '#FF6B6B' })
    }
  }, [])

  return (
    <MapContainer ref={mapRef} />
  )
}
```

## 🔧 Integración en Rutas (Next Steps)

Si usas React Router, agrega esto en tu archivo de rutas:

```javascript
import MapPage from './App/Gestion-administracion-propiedades/gestion-propiedad/page/MapPage'

const routes = [
  // ... otros routes
  {
    path: '/propiedades/mapa',
    element: <MapPage />,
    requiresAuth: true  // Según tu configuración
  }
]
```

## 📊 API Mockeada - Estructura de Propiedades

Cuando conectes con el backend, espera este formato:

```javascript
{
  id: 1,
  name: 'Nombre de la propiedad',
  type: 'Casa/Departamento/Loft/Terreno',
  price: 150000,
  bedrooms: 3,
  bathrooms: 2,
  area: 250,  // en m²
  coordinates: [-78.5149, -0.3522],  // [lng, lat]
  image: 'https://...',
  description: 'Descripción',
  // ... otros campos según necesidad
}
```

## 🔑 Variables de Entorno

Para producción, considera usar variables de entorno:

```bash
# .env
VITE_MAPBOX_TOKEN=tu_token_aqui
```

Luego en `src/config/mapbox.js`:

```javascript
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
  // ...
}
```

## 📱 Responsive Design

El mapa es totalmente responsivo. En dispositivos pequeños:
- El sidebar se coloca debajo
- Los controles se adaptan automáticamente
- El mapa ocupa el 100% del ancho disponible

## ⚙️ Configuración Mapbox

### Cambiar estilo del mapa

En `MapContainer.jsx`, línea ~47:

```javascript
style: 'mapbox://styles/mapbox/streets-v12'
```

Opciones disponibles:
- `streets-v12` - Calles
- `outdoors-v12` - Exteriores
- `light-v11` - Claro
- `dark-v11` - Oscuro
- `satellite-v9` - Satélite

### Limitar área del mapa

```javascript
mapRef.current.setMaxBounds([[-81, -5], [-76, 1]])
```

### Agregar capas customizadas

```javascript
mapRef.current.addSource('my-data', {
  type: 'geojson',
  data: { /* GeoJSON aquí */ }
})

mapRef.current.addLayer({
  id: 'my-layer',
  type: 'fill',
  source: 'my-data',
  paint: { 'fill-color': '#667eea' }
})
```

## 🐛 Solución de Problemas

**Problema: Token no válido o mapa no se muestra**
- Verifica que el token esté correcto en `src/config/mapbox.js`
- Asegurate que el token tenga permisos de lectura (`Maps: Read` scope)

**Problema: Mapa se ve pixelado o borroso**
- Es normal en navegadores con zoom personalizado
- En producción debería verse bien

**Problema: Errores de CORS**
- Asegurate que el token es válido
- Verifica que el dominio está whitelistado en Mapbox

**Problema: Performance lenta**
- No agregues demasiadas capas/marcadores sin clustering
- Implementa clustering para muchos puntos

## 📚 Recursos Útiles

- [Documentación MapBox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Ejemplos MapBox](https://docs.mapbox.com/mapbox-gl-js/examples/)
- [GeoJSON Spec](https://geojson.org/)
- [Leaflet vs MapBox (comparativa)](https://leafletjs.com/reference.html)

## 🎯 Checklist de Verificación

Antes de llevar a producción:

- [ ] Token de Mapbox configurado correctamente
- [ ] Mapa se carga sin errores en dev
- [ ] Responsive design funciona en móviles
- [ ] Popups y marcadores funcionan correctamente
- [ ] Controles del mapa están accesibles
- [ ] Sin errores en consola
- [ ] Performance es aceptable (carga < 2s)
- [ ] SSL/HTTPS configurado en producción

## 💡 Tips y Trucos

### Obtener coordenadas de un lugar

```javascript
// Hacer click en el mapa para obtener coordenadas
map.on('click', (e) => {
  console.log(`[${e.lngLat.lng}, ${e.lngLat.lat}]`)
})
```

### Centrar mapa en múltiples puntos

```javascript
const bounds = new mapboxgl.LngLatBounds()
properties.forEach(p => bounds.extend(p.coordinates))
mapRef.current.fitBounds(bounds, { padding: 50 })
```

### Personalizar marcadores con imágenes

```javascript
const element = document.createElement('img')
element.src = 'path/to/icon.png'
element.style.width = '40px'
element.style.height = '40px'

new mapboxgl.Marker({ element }).setLngLat(coords).addTo(map)
```

## 📞 Soporte

Para dudas o problemas específicos con la implementación:
1. Verifica la documentación en `src/shared/map/README.md`
2. Consulta los ejemplos en `PropertyMapExample.jsx`
3. Revisa la consola del navegador para errores específicos
