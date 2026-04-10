import { EditButton, DeleteButton, EstadoButton } from "../../../../shared/ui/components/buttons"
import { useAuth } from "../../../auth/context/AuthContext"

export const RolTable = ({ roles, onToggleEstado, onEditar, onEliminar }) => {
  const { tienePermiso } = useAuth()

  const puedeEditar        = tienePermiso("editar")
  const puedeEliminar      = tienePermiso("eliminar")
  const puedeCambiarEstado = tienePermiso("cambiar_estado")

  return (
    <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--outline-variant)/20">
          <thead className="bg-(--surface-container-low)">
            <tr>
              {["Rol", "Descripción", "Permisos", "Usuarios", "Estado", "Acciones"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--outline-variant)/10">
            {!roles?.length ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-(--on-surface-variant) text-sm">
                  No hay roles registrados
                </td>
              </tr>
            ) : (
              roles.map(rol => (
                <tr key={rol.id} className="hover:bg-(--surface-container-low) transition-colors">

                  {/* Rol */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-(--on-surface) text-sm">{rol.nombre}</span>
                  </td>

                  {/* Descripción */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-(--on-surface-variant)">
                      {rol.descripcion || <span className="italic opacity-50">Sin descripción</span>}
                    </span>
                  </td>

                  {/* Permisos */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-(--surface-container) text-(--on-surface-variant) rounded-full">
                      {rol.permisos_info?.length || 0} permisos
                    </span>
                  </td>

                  {/* Usuarios */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-(--on-surface-variant)">
                      {rol.usuarios_count || 0} usuarios
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      rol.estado
                        ? "bg-(--tertiary-container) text-(--on-tertiary-container)"
                        : "bg-(--surface-container) text-(--on-surface-variant)"
                    }`}>
                      {rol.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EstadoButton
                        onClick={() => onToggleEstado(rol)}
                        disabled={!puedeCambiarEstado}
                        activo={rol.estado}
                      />
                      <EditButton
                        onClick={() => onEditar(rol)}
                        disabled={!puedeEditar}
                      />
                      <DeleteButton
                        onClick={() => onEliminar(rol)}
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