import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_CONFIG } from '../../../config/mapbox.js'
import './MapContainer.css'

/**
 * Componente de Mapa Reutilizable con MapBox
 * 
 * Props:
 * - center: Array [longitude, latitude] - Centro inicial del mapa
 * - zoom: Number - Nivel de zoom inicial
 * - pitch: Number - Inclinación del mapa (0-60)
 * - bearing: Number - Rotación del mapa
 * - onLoad: Function - Callback cuando el mapa se carga
 * - onMapClick: Function - Callback cuando se hace click en el mapa
 * - className: String - Clases CSS adicionales
 * - controlOptions: Object - Opciones de controles del mapa
 */
const MapContainer = forwardRef(({
  center = MAPBOX_CONFIG.defaultCenter,
  zoom = MAPBOX_CONFIG.defaultZoom,
  pitch = MAPBOX_CONFIG.defaultPitch,
  bearing = MAPBOX_CONFIG.defaultBearing,
  onLoad = null,
  onMapClick = null,
  className = '',
  controlOptions = {
    showNavigation: true,
    showScale: true,
    showGeolocate: true
  }
}, ref) => {
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)

  // Exponer métodos del mapa a través del ref
  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
    getCenter: () => mapRef.current?.getCenter(),
    getZoom: () => mapRef.current?.getZoom(),
    getPitch: () => mapRef.current?.getPitch(),
    getBearing: () => mapRef.current?.getBearing(),
    setCenter: (center) => mapRef.current?.setCenter(center),
    setZoom: (zoom) => mapRef.current?.setZoom(zoom),
    flyTo: (options) => mapRef.current?.flyTo(options),
    setBearing: (bearing) => mapRef.current?.setBearing(bearing),
    setPitch: (pitch) => mapRef.current?.setPitch(pitch),
    addLayer: (layer, before) => mapRef.current?.addLayer(layer, before),
    removeLayer: (layerId) => mapRef.current?.removeLayer(layerId),
    addSource: (id, source) => mapRef.current?.addSource(id, source),
    removeSource: (sourceId) => mapRef.current?.removeSource(sourceId),
    on: (event, callback) => mapRef.current?.on(event, callback),
    off: (event, callback) => mapRef.current?.off(event, callback),
  }), [])

  useEffect(() => {
    // Configurar token de acceso
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    // Inicializar el mapa
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
      pitch,
      bearing,
      antialias: true
    })

    // Agregar controles
    if (controlOptions.showNavigation) {
      mapRef.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
        'top-right'
      )
    }

    if (controlOptions.showScale) {
      mapRef.current.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }),
        'bottom-left'
      )
    }

    if (controlOptions.showGeolocate) {
      mapRef.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
          showUserLocation: true
        }),
        'top-right'
      )
    }

    // Evento de carga del mapa
    mapRef.current.on('load', () => {
      if (onLoad) onLoad(mapRef.current)
    })

    // Evento de click en el mapa
    if (onMapClick) {
      mapRef.current.on('click', (e) => {
        onMapClick(e, mapRef.current)
      })
    }

    // Cleanup
    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <div
      ref={mapContainerRef}
      className={`map-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  )
})

MapContainer.displayName = 'MapContainer'

export default MapContainer
