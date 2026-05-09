import { useState } from "react"
import { Shield, Search, X } from "lucide-react"
import { useRol } from "../hooks/useRol"
import { useAuth } from "../../../auth/context/AuthContext"
import { RolTable } from "../components/RolTable"
import { CreateRolModal } from "../components/CreateRolModal"
import { EditRolModal } from "../components/EditRolModal"
import { CreateButton, ExportButton } from "../../../../shared/ui/components/buttons"

export const RolPage = () => {
  const { tienePermiso } = useAuth()

  const [search, setSearch] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState("")
  const [modalCrear, setModalCrear] = useState(false)
  const [rolEdit, setRolEdit] = useState(null)

  const filtros = {
    search: search || undefined,
    estado: estadoFiltro || undefined,
  }

  const { roles, toggleEstado, eliminar } = useRol(filtros)
  const puedeCrear = tienePermiso("crear")

  const handleToggleEstado = (rol) => {
    if (window.confirm(`¿${rol.estado ? "Desactivar" : "Activar"} el rol "${rol.nombre}"?`))
      toggleEstado.mutate(rol.id)
  }

  const handleEliminar = (rol) => {
    if (window.confirm(`¿Eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`))
      eliminar.mutate(rol.id)
  }

  const hayFiltros = search || estadoFiltro
  const lista = roles.data?.results || roles.data || []

  // Preparar datos para exportación
  const exportSecciones = [
    {
      titulo: 'Roles del Sistema',
      columnas: ['Rol', 'Descripción', 'Permisos', 'Usuarios', 'Estado'],
      datos: lista,
      mapearDatos: (rol) => [
        rol.nombre,
        rol.descripcion || 'Sin descripción',
        `${rol.permisos_info?.length || 0} permisos`,
        `${rol.usuarios_count || 0} usuarios`,
        rol.estado ? 'Activo' : 'Inactivo'
      ]
    }
  ]

  const exportMetadata = {
    'Fecha generación': new Date().toLocaleString(),
    'Total roles': lista.length,
    'Roles activos': lista.filter(r => r.estado).length,
    'Roles inactivos': lista.filter(r => !r.estado).length,
  }

  const handleExport = (tipo) => {
    console.log(`Exportando reporte de roles como ${tipo}...`)
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
                <Shield className="w-6 h-6 text-blue-600" />
                Roles
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-3">
              {lista.length} roles registrados en el sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton
              empresa="Inmobiliaria"
              titulo="Reporte de Roles"
              metadata={exportMetadata}
              secciones={exportSecciones}
              onExport={handleExport}
            />
            <CreateButton onClick={() => setModalCrear(true)} disabled={!puedeCrear}>
              Nuevo Rol
            </CreateButton>
          </div>
        </div>
      </div>

      {/* Filtros mejorados */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rol por nombre..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          {hayFiltros && (
            <button
              onClick={() => { setSearch(""); setEstadoFiltro("") }}
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
                Estado: {estadoFiltro === 'true' ? 'Activos' : 'Inactivos'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      {roles.isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando roles...</p>
        </div>
      ) : (
        <RolTable
          roles={lista}
          onToggleEstado={handleToggleEstado}
          onEditar={(r) => setRolEdit(r)}
          onEliminar={handleEliminar}
        />
      )}

      {/* Modales */}
      {modalCrear && <CreateRolModal onClose={() => setModalCrear(false)} />}
      {rolEdit && <EditRolModal rol={rolEdit} onClose={() => setRolEdit(null)} />}
    </div>
  )
}