import { useState } from "react"
import { Users, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useUsuario } from "../hooks/useUsuario"
import { useRol } from "../../gestion-rol/hooks/useRol"
import { useAuth } from "../../../auth/context/AuthContext"
import { UsuarioTable }       from "../components/UsuarioTable"
import { CreateUsuarioModal } from "../components/CreateUsuarioModal"
import { EditUsuarioModal }   from "../components/EditUsuarioModal"
import { CreateButton, ExportButton } from "../../../../shared/ui/components/buttons"

export const UsuarioPage = () => {
  const { tienePermiso } = useAuth()

  const [search,      setSearch]      = useState("")
  const [rolFiltro,   setRolFiltro]   = useState("")
  const [estadoFiltro,setEstadoFiltro]= useState("")
  const [page,        setPage]        = useState(1)
  const [modalCrear,  setModalCrear]  = useState(false)
  const [usuarioEdit, setUsuarioEdit] = useState(null)

  const filtros = {
    search:    search      || undefined,
    "roles[]": rolFiltro   || undefined,
    estado:    estadoFiltro || undefined,
    page,
  }

  const { usuarios, toggleEstado, eliminar } = useUsuario(filtros)
  const { roles }                            = useRol()

  const puedeCrear = tienePermiso("crear")

  const handleToggleEstado = (usuario) => {
    if (window.confirm(`¿${usuario.estado ? "Desactivar" : "Activar"} a "${usuario.username}"?`))
      toggleEstado.mutate(usuario.id)
  }

  const handleEliminar = (usuario) => {
    if (window.confirm(`¿Eliminar a "${usuario.username}"? Esta acción no se puede deshacer.`))
      eliminar.mutate(usuario.id)
  }

  const limpiarFiltros = () => {
    setSearch(""); setRolFiltro(""); setEstadoFiltro(""); setPage(1)
  }

  const hayFiltros  = search || rolFiltro || estadoFiltro
  const data        = usuarios.data
  const total       = data?.count    || 0
  const totalPages  = Math.ceil(total / 10)
  const lista       = data?.results  || []

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--on-surface) flex items-center gap-2">
            <Users className="w-6 h-6" />
            Usuarios
          </h1>
          <p className="text-sm text-(--on-surface-variant) mt-1">
            {total} usuarios registrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <CreateButton onClick={() => setModalCrear(true)} disabled={!puedeCrear}>
            Nuevo Usuario
          </CreateButton>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--on-surface-variant)" />
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full pl-9 pr-4 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
            />
          </div>

          <select
            value={rolFiltro}
            onChange={(e) => { setRolFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
          >
            <option value="">Todos los roles</option>
            {(roles.data?.results || roles.data || []).map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1) }}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-3 py-2 text-sm text-(--on-surface-variant) hover:text-(--on-surface) border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {usuarios.isLoading ? (
        <div className="text-center py-12 text-(--on-surface-variant)">Cargando...</div>
      ) : (
        <>
          <UsuarioTable
            usuarios={lista}
            onToggleEstado={handleToggleEstado}
            onEditar={(u) => setUsuarioEdit(u)}
            onEliminar={handleEliminar}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-(--on-surface-variant)">
                Página {page} de {totalPages} — {total} usuarios
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition disabled:opacity-50"
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
                    <span key={`dots-${i}`} className="px-2 text-(--on-surface-variant)">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? "bg-(--primary) text-(--on-primary)"
                          : "border border-(--outline-variant)/40 hover:bg-(--surface-container) text-(--on-surface-variant)"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-(--outline-variant)/40 rounded-lg hover:bg-(--surface-container) transition disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear  && <CreateUsuarioModal onClose={() => setModalCrear(false)} />}
      {usuarioEdit && <EditUsuarioModal usuario={usuarioEdit} onClose={() => setUsuarioEdit(null)} />}
    </div>
  )
}
