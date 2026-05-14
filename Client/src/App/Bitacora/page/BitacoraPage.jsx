import { useEffect, useState } from "react"
import {
  Calendar as CalendarIcon,
  FileSearch,
  Lock,
  Search,
  ShieldAlert,
  X,
} from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { listarBitacora, verificarClaveBitacora } from "../api/bitacoraApi"
import { BitacoraTable } from "../components/BitacoraTable"

const BITACORA_STORAGE_KEY = "bitacora_access_granted"

export const BitacoraPage = () => {
  const [password, setPassword] = useState("")
  const [mensajeError, setMensajeError] = useState("")
  const [search, setSearch] = useState("")
  const [moduloFiltro, setModuloFiltro] = useState("")
  const [accionFiltro, setAccionFiltro] = useState("")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [desbloqueada, setDesbloqueada] = useState(
    () => sessionStorage.getItem(BITACORA_STORAGE_KEY) === "true"
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bitacora"],
    queryFn: listarBitacora,
    enabled: desbloqueada,
    retry: false,
  })

  const verificarClave = useMutation({
    mutationFn: verificarClaveBitacora,
    onSuccess: async () => {
      sessionStorage.setItem(BITACORA_STORAGE_KEY, "true")
      setDesbloqueada(true)
      setMensajeError("")
      setPassword("")
      await refetch()
    },
    onError: (mutationError) => {
      const backendMessage =
        mutationError.response?.data?.error ||
        mutationError.response?.data?.detail ||
        "No se pudo validar la contrasena."
      setMensajeError(backendMessage)
    },
  })

  useEffect(() => {
    if (error?.response?.status === 403) {
      sessionStorage.removeItem(BITACORA_STORAGE_KEY)
      setDesbloqueada(false)
      setMensajeError(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Debes volver a verificar la contrasena de bitacora."
      )
    }
  }, [error])

  const handleSubmit = (event) => {
    event.preventDefault()
    setMensajeError("")
    verificarClave.mutate(password)
  }

  const cerrarModal = () => {
    setPassword("")
    setMensajeError("")
    window.history.back()
  }

  const limpiarFiltros = () => {
    setSearch("")
    setModuloFiltro("")
    setAccionFiltro("")
    setFechaDesde("")
    setFechaHasta("")
  }

  const logsBase = Array.isArray(data) ? data : (data?.results || [])
  const modulos = [...new Set(logsBase.map((log) => log.modulo).filter(Boolean))].sort()
  const acciones = [...new Set(logsBase.map((log) => log.accion).filter(Boolean))].sort()

  const logs = logsBase.filter((log) => {
    const fechaEvento = log.fecha_evento ? new Date(log.fecha_evento) : null
    const fechaEventoTexto = fechaEvento && !Number.isNaN(fechaEvento.getTime())
      ? fechaEvento.toISOString().slice(0, 10)
      : ""

    const texto = [
      log.usuario_nombre,
      log.modulo,
      log.entidad,
      log.accion,
      log.detalle,
      log.ip_origen,
      log.user_agent,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const coincideBusqueda = !search || texto.includes(search.toLowerCase())
    const coincideModulo = !moduloFiltro || log.modulo === moduloFiltro
    const coincideAccion = !accionFiltro || log.accion === accionFiltro
    const coincideDesde = !fechaDesde || (fechaEventoTexto && fechaEventoTexto >= fechaDesde)
    const coincideHasta = !fechaHasta || (fechaEventoTexto && fechaEventoTexto <= fechaHasta)

    return (
      coincideBusqueda &&
      coincideModulo &&
      coincideAccion &&
      coincideDesde &&
      coincideHasta
    )
  })

  const hayFiltros = search || moduloFiltro || accionFiltro || fechaDesde || fechaHasta
  const total = logsBase.length
  const totalFiltrado = logs.length
  const totalLogins = logs.filter((log) => log.accion === "LOGIN").length
  const totalModulos = new Set(logs.map((log) => log.modulo).filter(Boolean)).size

  return (
    <main className="p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-amber-500"></div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                <FileSearch className="h-6 w-6 text-amber-600" />
                Bitacora
              </h1>
            </div>
            <p className="ml-3 text-sm text-gray-500">
              {totalFiltrado} registros visibles de {total} eventos del sistema
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
            <p className="font-semibold">
              Estado: {desbloqueada ? "Acceso verificado" : "Acceso bloqueado"}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Protegido con una contraseña adicional por sesión.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Registros visibles
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{totalFiltrado}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Eventos login
          </p>
          <p className="mt-2 text-2xl font-semibold text-green-600">{totalLogins}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Módulos activos
          </p>
          <p className="mt-2 text-2xl font-semibold text-blue-600">{totalModulos}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Seguridad
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900">
            {desbloqueada ? "Sesión validada" : "Pendiente de clave"}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por usuario, módulo, acción, IP o detalle..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={moduloFiltro}
            onChange={(event) => setModuloFiltro(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todos los módulos</option>
            {modulos.map((modulo) => (
              <option key={modulo} value={modulo}>{modulo}</option>
            ))}
          </select>

          <select
            value={accionFiltro}
            onChange={(event) => setAccionFiltro(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todas las acciones</option>
            {acciones.map((accion) => (
              <option key={accion} value={accion}>{accion}</option>
            ))}
          </select>

          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fechaDesde}
              onChange={(event) => setFechaDesde(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fechaHasta}
              onChange={(event) => setFechaHasta(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>

        {hayFiltros && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                Buscar: {search}
              </span>
            )}
            {moduloFiltro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                Módulo: {moduloFiltro}
              </span>
            )}
            {accionFiltro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                Acción: {accionFiltro}
              </span>
            )}
            {fechaDesde && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                Desde: {new Date(fechaDesde).toLocaleDateString("es-BO")}
              </span>
            )}
            {fechaHasta && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                Hasta: {new Date(fechaHasta).toLocaleDateString("es-BO")}
              </span>
            )}
          </div>
        )}
      </div>

      {desbloqueada && isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500"></div>
          <p className="text-sm text-gray-500">Cargando bitacora...</p>
        </div>
      ) : desbloqueada && !error ? (
        <BitacoraTable logs={logs} />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
          La bitacora se mostrará cuando verifiques la contraseña adicional.
        </div>
      )}

      {!desbloqueada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0px_28px_80px_rgba(15,23,42,0.28)]">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-700 px-6 py-5 text-white">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                  <Lock className="h-6 w-6" />
                </div>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                  aria-label="Cerrar modal de bitacora"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold">Proteccion de bitacora</h2>
              <p className="mt-2 text-sm text-white/80">
                Ingresa la contrasena especial para acceder a los registros del sistema.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contrasena de bitacora
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ingresa la contrasena"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                    autoFocus
                  />
                </div>
              </div>

              {mensajeError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {mensajeError}
                </div>
              )}

              <button
                type="submit"
                disabled={verificarClave.isPending || !password.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldAlert className="h-4 w-4" />
                {verificarClave.isPending ? "Verificando..." : "Desbloquear bitacora"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
