import { useState, useEffect, useCallback, useRef } from "react"
import { getCountNotificaciones, getNotificaciones, marcarLeida, marcarTodasLeidas } from "../api/notificacionApi"

export const useNotificaciones = () => {
  const [count, setCount]                   = useState(0)
  const [notificaciones, setNotificaciones] = useState([])
  const [open, setOpen]                     = useState(false)
  const [loading, setLoading]               = useState(false)
  const intervalRef                         = useRef(null)

  const fetchCount = useCallback(() => {
    getCountNotificaciones()
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [])

  const fetchNotificaciones = useCallback(() => {
    setLoading(true)
    getNotificaciones()
      .then(data => setNotificaciones(Array.isArray(data) ? data.slice(0, 20) : data.results?.slice(0, 20) ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchCount()
    intervalRef.current = setInterval(fetchCount, 30_000)
    return () => clearInterval(intervalRef.current)
  }, [fetchCount])

  const toggle = useCallback(() => {
    setOpen(prev => {
      if (!prev) fetchNotificaciones()
      return !prev
    })
  }, [fetchNotificaciones])

  const leer = useCallback(async (id) => {
    await marcarLeida(id)
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n))
    setCount(prev => Math.max(0, prev - 1))
  }, [])

  const leerTodas = useCallback(async () => {
    await marcarTodasLeidas()
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
    setCount(0)
  }, [])

  return { count, notificaciones, open, loading, toggle, leer, leerTodas, setOpen }
}
