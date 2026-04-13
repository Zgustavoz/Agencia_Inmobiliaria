import { useRef, useCallback } from 'react'

/**
 * Hook para usar el mapa de forma más fácil
 * Retorna métodos y propiedades del mapa
 */
export const useMap = () => {
  const mapRef = useRef(null)

  const getMap = useCallback(() => mapRef.current?.getMap(), [])

  const centerMap = useCallback((coordinates) => {
    mapRef.current?.setCenter(coordinates)
  }, [])

  const zoomTo = useCallback((zoom) => {
    mapRef.current?.setZoom(zoom)
  }, [])

  const flyToLocation = useCallback((coordinates, options = {}) => {
    mapRef.current?.flyTo({
      center: coordinates,
      zoom: options.zoom || 15,
      bearing: options.bearing || 0,
      pitch: options.pitch || 0,
      duration: options.duration || 2000,
      ...options
    })
  }, [])

  const addMarker = useCallback((coordinates, options = {}) => {
    // Crear un marcador personalizado
    const el = document.createElement('div')
    el.className = 'marker'
    el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="40" height="40"><circle cx="25" cy="25" r="20" fill="${options.color || "#FF6B6B"}" stroke="white" stroke-width="2"/></svg>')`
    el.style.width = '40px'
    el.style.height = '40px'
    el.style.backgroundSize = 'contain'
    el.style.cursor = 'pointer'

    const marker = new window.mapboxgl.Marker({
      element: el
    })
      .setLngLat(coordinates)
      .addTo(mapRef.current?.getMap())

    return marker
  }, [])

  const addPopup = useCallback((coordinates, content, options = {}) => {
    const popup = new window.mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      ...options
    })
      .setLngLat(coordinates)
      .setHTML(typeof content === 'string' ? content : '')
      .addTo(mapRef.current?.getMap())

    return popup
  }, [])

  return {
    mapRef,
    getMap,
    centerMap,
    zoomTo,
    flyToLocation,
    addMarker,
    addPopup
  }
}
