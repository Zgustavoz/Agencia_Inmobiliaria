import { useState } from "react"
import { Shield, Search, X } from "lucide-react"
import { useRol } from "../hooks/useRol"
import { useAuth } from "../../../auth/context/AuthContext"
import { RolTable }       from "../components/RolTable"
import { CreateRolModal } from "../components/CreateRolModal"
import { EditRolModal }   from "../components/EditRolModal"
import { CreateButton }   from "../../../../shared/ui/components/buttons"

export const RolPage = () => {
  const { tienePermiso } = useAuth()

  const [search,      setSearch]      = useState("")
  const [estadoFiltro,setEstadoFiltro]= useState("")
  const [modalCrear,  setModalCrear]  = useState(false)
  const [rolEdit,     setRolEdit]     = useState(null)

  const filtros = {
    search: search       || undefined,
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
  const lista      = roles.data?.results || roles.data || []

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--on-surface) flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Roles
          </h1>
          <p className="text-sm text-(--on-surface-variant) mt-1">
            {lista.length} roles registrados
          </p>
        </div>
        <CreateButton onClick={() => setModalCrear(true)} disabled={!puedeCrear}>
          Nuevo Rol
        </CreateButton>
      </div>

      {/* Filtros */}
      <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--on-surface-variant)" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rol..."
              className="w-full pl-9 pr-4 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          {hayFiltros && (
            <button
              onClick={() => { setSearch(""); setEstadoFiltro("") }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-(--on-surface-variant) border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {roles.isLoading ? (
        <div className="text-center py-12 text-(--on-surface-variant)">Cargando...</div>
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
      {rolEdit    && <EditRolModal rol={rolEdit} onClose={() => setRolEdit(null)} />}
    </div>
  )
}