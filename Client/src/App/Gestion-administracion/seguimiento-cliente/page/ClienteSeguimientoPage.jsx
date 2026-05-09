import { useState } from "react"
import { Users, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useCliente } from "../hooks/useCliente"
import { useAuth } from "../../../auth/context/AuthContext"
import { ClienteTable }           from "../components/ClienteTable"
import { CreateClienteModal }     from "../components/CreateClienteModal"
import { PanelSeguimientoModal }  from "../components/PanelSeguimientoModal"
import { CreateButton }           from "../../../../shared/ui/components/buttons"

const ESTADOS  = ["nuevo", "seguimiento", "activo", "inactivo", "cerrado"]
const ORIGENES = ["web", "movil", "referido", "agente", "campana"]

export const ClienteSeguimientoPage = () => {
  const { tienePermiso } = useAuth()

  const [search,       setSearch]       = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("")
  const [origenFiltro, setOrigenFiltro] = useState("")
  const [page,         setPage]         = useState(1)
  const [modalCrear,   setModalCrear]   = useState(false)
  const [clientePanel, setClientePanel] = useState(null)
  const [clienteEdit,  setClienteEdit]  = useState(null)

  const filtros = {
    search: search       || undefined,
    estado: estadoFiltro || undefined,
    origen: origenFiltro || undefined,
    page,
  }

  const { clientes, eliminar } = useCliente(filtros)
  const puedeCrear = tienePermiso("crear")

  const handleEliminar = (cliente) => {
    if (window.confirm(`¿Eliminar a "${cliente.nombres} ${cliente.apellidos}"?`))
      eliminar.mutate(cliente.id)
  }

  const limpiarFiltros = () => {
    setSearch(""); setEstadoFiltro(""); setOrigenFiltro(""); setPage(1)
  }

  const hayFiltros = search || estadoFiltro || origenFiltro
  const data       = clientes.data
  const total      = data?.count   || 0
  const totalPages = Math.ceil(total / 10)
  const lista      = data?.results || []

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--on-surface) flex items-center gap-2">
            <Users className="w-6 h-6" />
            Seguimiento de Clientes
          </h1>
          <p className="text-sm text-(--on-surface-variant) mt-1">{total} clientes registrados</p>
        </div>
        <CreateButton onClick={() => setModalCrear(true)} disabled={!puedeCrear}>
          Nuevo Cliente
        </CreateButton>
      </div>

      {/* Filtros */}
      <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--on-surface-variant)" />
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, email, código..."
              className="w-full pl-9 pr-4 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>
          <select value={estadoFiltro} onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)">
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={origenFiltro} onChange={(e) => { setOrigenFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)">
            <option value="">Todos los orígenes</option>
            {ORIGENES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {hayFiltros && (
            <button onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-2 text-sm text-(--on-surface-variant) border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition">
              <X size={14} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {clientes.isLoading ? (
        <div className="text-center py-12 text-(--on-surface-variant)">Cargando...</div>
      ) : (
        <>
          <ClienteTable
            clientes={lista}
            onEditar={(c) => setClienteEdit(c)}
            onEliminar={handleEliminar}
            onVerPanel={(c) => setClientePanel(c)}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-(--on-surface-variant)">
                Página {page} de {totalPages} — {total} clientes
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) => p === "..." ? (
                    <span key={`d-${i}`} className="px-2 text-(--on-surface-variant)">...</span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? "bg-(--primary) text-(--on-primary)"
                          : "border border-(--outline-variant)/40 hover:bg-(--surface-container) text-(--on-surface-variant)"
                      }`}>
                      {p}
                    </button>
                  ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear   && <CreateClienteModal onClose={() => setModalCrear(false)} />}
      {clientePanel && <PanelSeguimientoModal cliente={clientePanel} onClose={() => setClientePanel(null)} />}
    </div>
  )
}