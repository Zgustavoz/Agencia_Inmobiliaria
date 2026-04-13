import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapContainer from './MapContainer'
import { useMap } from '../hooks/useMap'
import './PropertyMapExample.css'

/**
 * Datos de propiedades mockeados para pruebas
 * Estructura lista para integración con API
 */
const mockProperties = [
  {
    id: 1,
    name: 'Casa Familiar en Equipetrol',
    type: 'Casa',
    price: '$150,000',
    bedrooms: 3,
    bathrooms: 2,
    area: '250 m²',
    coordinates: [-63.1950, -17.7701],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    description: 'Casa moderna en zona residencial de Santa Cruz'
  },
  {
    id: 2,
    name: 'Departamento en Urubo',
    type: 'Departamento',
    price: '$120,000',
    bedrooms: 2,
    bathrooms: 2,
    area: '150 m²',
    coordinates: [-63.2267, -17.7608],
    image: 'https://images.unsplash.com/photo-1512917774080-9a485dc08a04',
    description: 'Apartamento con acceso rapido al centro y zona comercial'
  },
  {
    id: 3,
    name: 'Casa Amplia en Sirari',
    type: 'Casa',
    price: '$180,000',
    bedrooms: 4,
    bathrooms: 3,
    area: '320 m²',
    coordinates: [-63.1854, -17.7762],
    image: 'https://images.unsplash.com/photo-1570129477492-45e003008e2c',
    description: 'Propiedad amplia ideal para familia en zona norte'
  },
  {
    id: 4,
    name: 'Loft en Centro de Santa Cruz',
    type: 'Loft',
    price: '$95,000',
    bedrooms: 1,
    bathrooms: 1,
    area: '80 m²',
    coordinates: [-63.1822, -17.7833],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    description: 'Loft moderno en area centrica con excelente conectividad'
  },
  {
    id: 5,
    name: 'Terreno en Zona Norte',
    type: 'Terreno',
    price: '$220,000',
    bedrooms: 0,
    bathrooms: 0,
    area: '5000 m²',
    coordinates: [-63.1601, -17.7425],
    image: 'https://images.unsplash.com/photo-1500382017468-f049863256f0',
    description: 'Terreno con alto potencial de desarrollo inmobiliario'
  },
  {
    id: 6,
    name: 'Casa en Barrio Hamacas',
    type: 'Casa',
    price: '$200,000',
    bedrooms: 3,
    bathrooms: 2,
    area: '280 m²',
    coordinates: [-63.2053, -17.7920],
    image: 'https://images.unsplash.com/photo-1516455207990-7a41e1d4fdf5',
    description: 'Casa de lujo en una de las zonas mas buscadas de la ciudad'
  }
]

/**
 * Componente de Ejemplo: Mapa con Propiedades Mockeadas
 * Este componente será reemplazado con datos reales de la API
 * 
 * Características:
 * - Muestra propiedades en el mapa
 * - Permite ver detalles al hacer click
 * - Sistema de filtrado listo para implementar
 */
export const PropertyMapExample = () => {
  const { mapRef } = useMap()
  const markersRef = useRef([])
  const [isMapReady, setIsMapReady] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0])

  const handleMapLoad = useCallback(() => {
    setIsMapReady(true)
  }, [])

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const map = mapRef.current.getMap()
    if (!map) return

    // Agregar propiedades al mapa
    mockProperties.forEach(property => {
      // Crear elemento del marcador
      const markerElement = document.createElement('div')
      markerElement.className = 'property-marker'
      markerElement.innerHTML = `
        <div class="marker-inner">
          <div class="marker-icon">🏠</div>
          <div class="marker-label">${property.type}</div>
        </div>
      `
      markerElement.style.cursor = 'pointer'

      // Crear marcador
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat(property.coordinates)
        .addTo(map)

      // Crear popup con información
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      })
        .setHTML(`
          <div class="property-popup">
            <h3>${property.name}</h3>
            <p class="property-type">${property.type}</p>
            <p class="property-price"><strong>${property.price}</strong></p>
            <div class="property-details">
              <span>🛏️ ${property.bedrooms} hab.</span>
              <span>🚿 ${property.bathrooms} baños</span>
              <span>📐 ${property.area}</span>
            </div>
            <p class="property-description">${property.description}</p>
            <button class="view-button">Ver Detalles</button>
          </div>
        `)

      // Event listeners
      markerElement.addEventListener('click', () => {
        setSelectedProperty(property)
        popup.addTo(map)
      })

      markersRef.current.push({ marker, popup })
    })

    return () => {
      markersRef.current.forEach(({ marker, popup }) => {
        marker.remove()
        popup.remove()
      })
      markersRef.current = []
    }
  }, [isMapReady, mapRef])

  const handleSelectProperty = useCallback((property) => {
    setSelectedProperty(property)
    const map = mapRef.current?.getMap()
    if (!map) return

    map.flyTo({
      center: property.coordinates,
      zoom: 10,
      duration: 1200,
      essential: true,
    })
  }, [mapRef])

  return (
    <div className="property-map-page">
      <div className="property-map-header">
        <h1>Mapa de Prueba</h1>
        <p>Visualizacion de propiedades mock en Santa Cruz, Bolivia</p>
      </div>
      <div className="property-map-body">
        <div className="property-map-canvas">
          <MapContainer
            ref={mapRef}
            center={[-63.1806, -17.7833]} // Santa Cruz de la Sierra
            zoom={11}
            onLoad={handleMapLoad}
          />
        </div>

        <aside className="property-map-sidepanel">
          <h2>Caracteristicas</h2>
          {selectedProperty ? (
            <div className="property-selected-card">
              <h3>{selectedProperty.name}</h3>
              <p className="property-selected-type">{selectedProperty.type}</p>
              <p className="property-selected-price">{selectedProperty.price}</p>
              <ul>
                <li>Habitaciones: {selectedProperty.bedrooms}</li>
                <li>Banos: {selectedProperty.bathrooms}</li>
                <li>Area: {selectedProperty.area}</li>
                <li>Coordenadas: {selectedProperty.coordinates[0]}, {selectedProperty.coordinates[1]}</li>
              </ul>
              <p className="property-selected-description">{selectedProperty.description}</p>
            </div>
          ) : (
            <p>Selecciona una propiedad en el mapa.</p>
          )}

          <div className="property-map-list">
            <h3>Ver propiedas</h3>
            {mockProperties.map((property) => (
              <button
                key={property.id}
                type="button"
                className={`property-list-item ${selectedProperty?.id === property.id ? 'active' : ''}`}
                onClick={() => handleSelectProperty(property)}
              >
                <span>{property.name}</span>
                <small>{property.price}</small>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default PropertyMapExample
