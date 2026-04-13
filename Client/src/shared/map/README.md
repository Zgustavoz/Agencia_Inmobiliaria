# Componente de Mapa MapBox - Guía de Uso

## 📦 Instalación

El componente ya está instalado. MapBox GL está disponible en `node_modules/mapbox-gl`.

## 📍 Ubicación

```
src/shared/map/
├── components/
│   ├── MapContainer.jsx      # Componente principal del mapa
│   └── MapContainer.css       # Estilos del mapa
├── hooks/
│   └── useMap.js              # Hook personalizado para usar el mapa
└── index.js                   # Exportaciones
```

## 🚀 Uso Básico

### Importar el componente

```jsx
import { MapContainer } from '../../shared/map'
import { useRef } from 'react'

export default function MyMapComponent() {
  const mapRef = useRef(null)

  return (
    <MapContainer
      ref={mapRef}
      center={[-73.5577, -2.1883]}  // [longitud, latitud]
      zoom={5}
      pitch={0}
      bearing={0}
      onLoad={(map) => console.log('Mapa cargado')}
      onMapClick={(event, map) => console.log('Click en mapa')}
    />
  )
}
```

## 📋 Props disponibles

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `center` | `[lng, lat]` | `[-73.5577, -2.1883]` | Coordenadas iniciales del mapa |
| `zoom` | `number` | `5` | Nivel de zoom inicial (0-24) |
| `pitch` | `number` | `0` | Inclinación del mapa en grados (0-60) |
| `bearing` | `number` | `0` | Rotación del mapa en grados (0-359) |
| `onLoad` | `function` | `null` | Callback cuando el mapa se carga |
| `onMapClick` | `function` | `null` | Callback cuando se hace click en el mapa |
| `className` | `string` | `''` | Clases CSS adicionales |
| `controlOptions` | `object` | Ver abajo | Opciones de controles del mapa |

### controlOptions

```javascript
{
  showNavigation: true,    // Mostrar zoom y brújula
  showScale: true,         // Mostrar escala
  showGeolocate: true      // Mostrar botón de geolocalización
}
```

## 🎮 Métodos disponibles a través del ref

Con `mapRef.current` puedes acceder a estos métodos:

```javascript
// Información
mapRef.current.getMap()           // Obtener instancia del mapa
mapRef.current.getCenter()        // Obtener centro actual
mapRef.current.getZoom()          // Obtener zoom actual
mapRef.current.getPitch()         // Obtener pitch actual
mapRef.current.getBearing()       // Obtener bearing actual

// Control
mapRef.current.setCenter([lng, lat])      // Ir a un punto específico
mapRef.current.setZoom(level)             // Cambiar zoom
mapRef.current.flyTo({ center, zoom })    // Animación a un punto
mapRef.current.setBearing(degrees)        // Cambiar rotación
mapRef.current.setPitch(degrees)          // Cambiar inclinación

// Capas y fuentes
mapRef.current.addLayer(layer, before)    // Agregar capa
mapRef.current.removeLayer(layerId)       // Remover capa
mapRef.current.addSource(id, source)      // Agregar fuente
mapRef.current.removeSource(sourceId)     // Remover fuente

// Eventos
mapRef.current.on(event, callback)        // Escuchar evento
mapRef.current.off(event, callback)       // Dejar de escuchar
```

## 🪝 Hook useMap

Para casos más avanzados, usa el hook `useMap`:

```jsx
import { MapContainer, useMap } from '../../shared/map'

export default function AdvancedMapComponent() {
  const { mapRef, flyToLocation, addMarker, addPopup } = useMap()

  const handleFlyTo = () => {
    flyToLocation([-73.988, 40.7128], { zoom: 15 }) // Nueva York
  }

  const handleAddMarker = () => {
    addMarker([-73.988, 40.7128], { color: '#FF6B6B' })
  }

  return (
    <div>
      <MapContainer ref={mapRef} />
      <button onClick={handleFlyTo}>Ir a Nueva York</button>
      <button onClick={handleAddMarker}>Agregar marcador</button>
    </div>
  )
}
```

### Métodos del hook useMap

```javascript
// mapRef - Ref al componente del mapa

flyToLocation(coordinates, options)
// options: { zoom, bearing, pitch, duration, ... }

addMarker(coordinates, options)
// options: { color, ... }

addPopup(coordinates, content, options)
// content: string (HTML) | React Element

centerMap(coordinates)
zoomTo(zoomLevel)
getMap()
```

## 📍 Ejemplo: Agregar Propiedades al Mapa

```jsx
import { useRef, useEffect } from 'react'
import { MapContainer, useMap } from '../../shared/map'

const mockProperties = [
  {
    id: 1,
    name: 'Casa en Quito',
    coordinates: [-78.5149, -0.3522],
    price: '$150,000'
  },
  {
    id: 2,
    name: 'Departamento en Guayaquil',
    coordinates: [-79.9019, -2.1457],
    price: '$120,000'
  }
]

export default function PropertyMapPage() {
  const { mapRef, addMarker } = useMap()

  useEffect(() => {
    if (!mapRef.current) return

    mockProperties.forEach(property => {
      addMarker(property.coordinates, {
        color: '#667eea'
      })
    })
  }, [])

  return (
    <MapContainer
      ref={mapRef}
      onLoad={() => console.log('Mapa listo')}
    />
  )
}
```

## 🎨 Estilos

El mapa utiliza mapas de Mapbox. Puedes cambiar el estilo modificando el `style` en `MapContainer.jsx`:

```javascript
// Estilos disponibles:
'mapbox://styles/mapbox/streets-v12'           // Calles
'mapbox://styles/mapbox/outdoors-v12'          // Exteriores
'mapbox://styles/mapbox/light-v11'             // Claro
'mapbox://styles/mapbox/dark-v11'              // Oscuro
'mapbox://styles/mapbox/satellite-v9'          // Satélite
'mapbox://styles/mapbox/satellite-streets-v12' // Satélite + Calles
```

## 🔑 Configuración del Token

El token de Mapbox está configurado en `src/config/mapbox.js`. Para cambiar el token:

```javascript
// src/config/mapbox.js
export const MAPBOX_CONFIG = {
  accessToken: 'tu_nuevo_token_aqui',
  // ... resto de configuración
}
```

## ⚠️ Consideraciones Importantes

1. **Costos**: Cada carga de mapa se cobra según el plan de Mapbox. Para desarrollo, usa cuentas gratuitas.

2. **Token**: Nunca comprometas el token en el repositorio. Considera usar variables de entorno en producción.

3. **Performance**: Evita crear múltiples instancias del mapa innecesariamente.

## 🔗 Rutas Recomendadas

Para integrar el mapa en tu aplicación, agrega una ruta como:

```javascript
// En tu archivo de rutas
import MapPage from './App/Gestion-administracion-propiedades/gestion-propiedad/page/MapPage'

{
  path: '/propiedades/mapa',
  element: <MapPage />
}
```

## 📚 Documentación de Referencia

- [MapBox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [MapBox GL JS Examples](https://docs.mapbox.com/mapbox-gl-js/examples/)

## 🚀 Próximas Características

En futuras iteraciones, se pueden agregar:

- 📍 Marcadores customizados con propiedades
- 🔀 Rutas entre puntos (usando PostGIS)
- 🏷️ Tags y clusters de propiedades
- 🔍 Búsqueda y filtrado avanzado
- 🛣️ Geocodificación inversa (dirección por coordenadas)
