import { useEffect, useRef } from "react"
import { Bell, Building2, X, CheckCheck } from "lucide-react"
import { useNotificaciones } from "../hooks/useNotificaciones"

const TIPO_ICONO = {
  propiedad: Building2,
  contrato:  Building2,
  pago:      Building2,
  sistema:   Bell,
}

const formatFecha = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export const NotificationBell = ({ collapsed = false }) => {
  const { count, notificaciones, open, loading, toggle, leer, leerTodas, setOpen } = useNotificaciones()
  const panelRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, setOpen])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={toggle}
        className="relative flex items-center justify-center w-8 h-8 rounded-lg text-(--on-surface-variant) hover:bg-(--surface-container) hover:text-(--on-surface) transition-colors"
        title="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-(--primary) text-(--on-primary) text-[10px] font-bold flex items-center justify-center leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed z-50 bg-(--surface-container-lowest) border border-(--outline-variant)/30 rounded-xl shadow-xl overflow-hidden"
          style={{ top: 64, left: collapsed ? 80 : 268, width: 340 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-(--outline-variant)/20">
            <span className="text-sm font-semibold text-(--on-surface)">
              Notificaciones {count > 0 && <span className="text-(--primary)">({count})</span>}
            </span>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  type="button"
                  onClick={leerTodas}
                  className="flex items-center gap-1 text-xs text-(--on-surface-variant) hover:text-(--primary) px-2 py-1 rounded transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Todas leídas
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded text-(--on-surface-variant) hover:text-(--on-surface) transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8 text-(--on-surface-variant) text-sm">
                Cargando...
              </div>
            )}

            {!loading && notificaciones.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-(--on-surface-variant)">
                <Bell className="w-8 h-8 opacity-30" />
                <span className="text-sm">Sin notificaciones</span>
              </div>
            )}

            {!loading && notificaciones.map((n) => {
              const Icono = TIPO_ICONO[n.tipo] ?? Bell
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.leida && leer(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-(--outline-variant)/10 last:border-0 transition-colors ${
                    n.leida
                      ? 'opacity-60 hover:bg-(--surface-container-low)'
                      : 'bg-(--primary)/5 hover:bg-(--primary)/10'
                  }`}
                >
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                    n.leida ? 'bg-(--surface-container)' : 'bg-(--primary)/15'
                  }`}>
                    <Icono className={`w-3.5 h-3.5 ${n.leida ? 'text-(--on-surface-variant)' : 'text-(--primary)'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-(--on-surface) truncate">{n.titulo}</p>
                    <p className="text-xs text-(--on-surface-variant) line-clamp-2 mt-0.5">{n.cuerpo}</p>
                    <p className="text-[10px] text-(--on-surface-variant)/60 mt-1">{formatFecha(n.creada_en)}</p>
                  </div>
                  {!n.leida && (
                    <div className="w-2 h-2 rounded-full bg-(--primary) shrink-0 mt-2" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
