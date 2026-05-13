import { useState } from "react"
import { Users, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useCliente } from "../hooks/useCliente"
import { useAuth } from "../../../auth/context/AuthContext"
import { ClienteTable } from "../components/ClienteTable"
import { CreateClienteModal } from "../components/CreateClienteModal"
import { PanelSeguimientoModal } from "../components/PanelSeguimientoModal"
import { CreateButton, ExportButton } from "../../../../shared/ui/components/buttons"
import { EditClienteModal } from "../components/EditClienteModal"

const ESTADOS = ["nuevo", "seguimiento", "activo", "inactivo", "cerrado"]
const ORIGENES = ["web", "movil", "referido", "agente", "campana"]

export const ClienteSeguimientoPage = () => {
  const { tienePermiso } = useAuth()

  const [search, setSearch] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("")
  const [origenFiltro, setOrigenFiltro] = useState("")
  const [page, setPage] = useState(1)
  const [modalCrear, setModalCrear] = useState(false)
  const [clientePanel, setClientePanel] = useState(null)
  const [clienteEdit, setClienteEdit] = useState(null)

  const filtros = {
    search: search || undefined,
    estado: estadoFiltro || undefined,
    origen: origenFiltro || undefined,
    page,
  }

  const { clientes, eliminar } = useCliente(filtros)
  const puedeCrear = tienePermiso("clientes", "crear")
  const puedeExportar = tienePermiso("clientes", "exportar")

  const handleEliminar = (cliente) => {
    if (window.confirm(`¿Eliminar a "${cliente.nombres} ${cliente.apellidos}"?`))
      eliminar.mutate(cliente.id)
  }

  const limpiarFiltros = () => {
    setSearch("")
    setEstadoFiltro("")
    setOrigenFiltro("")
    setPage(1)
  }

  const hayFiltros = search || estadoFiltro || origenFiltro
  const data = clientes.data
  const total = data?.count || 0
  const totalPages = Math.ceil(total / 10)
  const lista = data?.results || []

  // Preparar datos para exportación
  const exportSecciones = [
    {
      titulo: 'Clientes Registrados',
      columnas: ['Cliente', 'Email', 'Teléfono', 'WhatsApp', 'Estado', 'Origen', 'Interacciones', 'Oportunidades', 'Agente'],
      datos: lista,
      mapearDatos: (cliente) => [
        `${cliente.nombres} ${cliente.apellidos} (${cliente.codigo_cliente})`,
        cliente.email || '-',
        cliente.telefono || '-',
        cliente.whatsapp || '-',
        cliente.estado || '-',
        cliente.origen || '-',
        cliente.total_interacciones || 0,
        cliente.total_oportunidades || 0,
        cliente.agente_principal || 'Sin asignar'
      ]
    },
    {
      titulo: 'Estadísticas de Clientes',
      columnas: ['Métrica', 'Valor'],
      datos: [
        { metrica: 'Total Clientes', valor: total },
        { metrica: 'Clientes Nuevos', valor: lista.filter(c => c.estado === 'nuevo').length },
        { metrica: 'Clientes en Seguimiento', valor: lista.filter(c => c.estado === 'seguimiento').length },
        { metrica: 'Clientes Activos', valor: lista.filter(c => c.estado === 'activo').length },
        { metrica: 'Clientes Inactivos', valor: lista.filter(c => c.estado === 'inactivo').length },
        { metrica: 'Clientes Cerrados', valor: lista.filter(c => c.estado === 'cerrado').length },
        { metrica: 'Total Interacciones', valor: lista.reduce((sum, c) => sum + (c.total_interacciones || 0), 0) },
        { metrica: 'Total Oportunidades', valor: lista.reduce((sum, c) => sum + (c.total_oportunidades || 0), 0) },
      ],
      mapearDatos: (item) => [item.metrica, item.valor]
    }
  ]

  const exportMetadata = {
    'Fecha generación': new Date().toLocaleString(),
    'Total clientes': total,
    'Filtros aplicados': hayFiltros ? 'Sí' : 'No',
  }

  const handleExport = (tipo) => {
    console.log(`Exportando reporte de clientes como ${tipo}...`)
  }

  return (
    <div className="p-6">

      {/* Header mejorado */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Seguimiento de Clientes
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-3">
              {total} clientes registrados en el sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton
              empresa="Inmobiliaria"
              titulo="Reporte de Clientes"
              metadata={exportMetadata}
              secciones={exportSecciones}
              onExport={handleExport}
              disabled={!puedeExportar}
            />
            <CreateButton onClick={() => setModalCrear(true)} disabled={!puedeCrear}>
              Nuevo Cliente
            </CreateButton>
          </div>
        </div>
      </div>

      {/* Filtros mejorados */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, email, código..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
          </select>

          <select
            value={origenFiltro}
            onChange={(e) => { setOrigenFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los orígenes</option>
            {ORIGENES.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Indicador de filtros activos */}
        {hayFiltros && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Buscar: {search}
              </span>
            )}
            {estadoFiltro && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Estado: {estadoFiltro}
              </span>
            )}
            {origenFiltro && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Origen: {origenFiltro}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      {clientes.isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando clientes...</p>
        </div>
      ) : (
        <>
          <ClienteTable
            clientes={lista}
            onEditar={(c) => setClienteEdit(c)}
            onEliminar={handleEliminar}
            onVerPanel={(c) => setClientePanel(c)}
          />

          {/* Paginación mejorada */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Mostrando página {page} de {totalPages} — Total: {total} clientes
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                    <span key={`d-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear && <CreateClienteModal onClose={() => setModalCrear(false)} />}
      {clientePanel && <PanelSeguimientoModal cliente={clientePanel} onClose={() => setClientePanel(null)} />}
      {clienteEdit && <EditClienteModal cliente={clienteEdit} onClose={() => setClienteEdit(null)} />}
    </div>
  )
}
