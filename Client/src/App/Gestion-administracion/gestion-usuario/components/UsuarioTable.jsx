import { Mail, Phone, Calendar } from "lucide-react"
import { EditButton, DeleteButton, EstadoButton } from "../../../../shared/ui/components/buttons"
import { useAuth } from "../../../auth/context/AuthContext"

export const UsuarioTable = ({ usuarios, onToggleEstado, onEditar, onEliminar }) => {
  const { tienePermiso } = useAuth()

  const puedeEditar        = tienePermiso("editar")
  const puedeEliminar      = tienePermiso("eliminar")
  const puedeCambiarEstado = tienePermiso("cambiar_estado")

  const getRoles = (usuario) => {
    if (!usuario.roles_info?.length)
      return <span className="text-(--on-surface-variant) text-xs italic">Sin rol</span>
    const primeros  = usuario.roles_info.slice(0, 2)
    const restantes = usuario.roles_info.length - 2
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {primeros.map(rol => (
          <span key={rol.id} className="px-2 py-0.5 text-xs bg-(--surface-container) text-(--on-surface-variant) rounded-full">
            {rol.nombre}
          </span>
        ))}
        {restantes > 0 && (
          <span className="px-2 py-0.5 text-xs bg-(--surface-container-high) text-(--on-surface-variant) rounded-full">
            +{restantes}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--outline-variant)/20">
          <thead className="bg-(--surface-container-low)">
            <tr>
              {["Usuario", "Contacto", "Roles", "Registro", "Estado", "Acciones"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--outline-variant)/10">
            {!usuarios?.length ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-(--on-surface-variant) text-sm">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map(usuario => (
                <tr key={usuario.id} className="hover:bg-(--surface-container-low) transition-colors">

                  {/* Usuario */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-(--surface-container) rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-(--on-surface-variant)">
                          {usuario.nombres?.[0] || usuario.username?.[0] || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-(--on-surface) text-sm">
                          {usuario.nombres} {usuario.apellidos}
                        </div>
                        <div className="text-xs text-(--on-surface-variant)">@{usuario.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                        <Mail className="w-3 h-3" />
                        {usuario.email}
                      </div>
                      {usuario.telefono && (
                        <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                          <Phone className="w-3 h-3" />
                          {usuario.telefono}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-6 py-4">{getRoles(usuario)}</td>

                  {/* Registro */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                      <Calendar className="w-3 h-3" />
                      {new Date(usuario.creado_en).toLocaleDateString("es-BO")}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      usuario.estado
                        ? "bg-(--tertiary-container) text-(--on-tertiary-container)"
                        : "bg-(--surface-container) text-(--on-surface-variant)"
                    }`}>
                      {usuario.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EstadoButton
                        onClick={() => onToggleEstado(usuario)}
                        disabled={!puedeCambiarEstado}
                        activo={usuario.estado}
                      />
                      <EditButton
                        onClick={() => onEditar(usuario)}
                        disabled={!puedeEditar}
                      />
                      <DeleteButton
                        onClick={() => onEliminar(usuario)}
                        disabled={!puedeEliminar}
                      />
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}