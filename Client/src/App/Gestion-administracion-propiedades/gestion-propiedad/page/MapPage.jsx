import { useRef } from 'react'
import { MapContainer } from '../../../../shared/map'

/**
 * Página de prueba del componente de Mapa
 * Aquí visualizaremos las propiedades en el mapa
 */
export default function MapPage() {
  const mapRef = useRef(null)

  const handleMapLoad = (map) => {
    console.log('Mapa cargado correctamente', map)
  }

  const handleMapClick = (event, map) => {
    const { lng, lat } = event.lngLat
    console.log(`Click en coordenadas: ${lng}, ${lat}`)
  }

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Visualización de Propiedades</h1>
        <p className="map-subtitle">Explora todas nuestras propiedades disponibles</p>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          ref={mapRef}
          center={[-73.5577, -2.1883]} // Ecuador
          zoom={5}
          pitch={0}
          bearing={0}
          onLoad={handleMapLoad}
          onMapClick={handleMapClick}
          controlOptions={{
            showNavigation: true,
            showScale: true,
            showGeolocate: true
          }}
        />
      </div>

      <div className="map-sidebar">
        <div className="sidebar-section">
          <h2>Información del Mapa</h2>
          <div className="info-group">
            <label>Centro:</label>
            <p id="map-center">-73.5577, -2.1883</p>
          </div>
          <div className="info-group">
            <label>Zoom:</label>
            <p id="map-zoom">5</p>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Controles Disponibles</h3>
          <ul className="controls-list">
            <li>🔍 Zoom: Rueda del mouse o botones de zoom</li>
            <li>🔄 Rotación: Presiona Alt + arrastra el mouse</li>
            <li>📍 Localización: Botón de geolocalización</li>
            <li>🧭 Brújula: Reorienta el mapa hacia el norte</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
