import { Mail, Phone, MessageCircle } from "lucide-react"
import { EditButton, DeleteButton } from "../../../../shared/ui/components/buttons"
import { useAuth } from "../../../auth/context/AuthContext"

const ESTADO_COLORES = {
  nuevo:        "bg-(--primary-fixed) text-(--on-primary-fixed)",
  seguimiento:  "bg-(--secondary-fixed) text-(--on-secondary-fixed)",
  activo:       "bg-(--tertiary-container) text-(--on-tertiary-container)",
  inactivo:     "bg-(--surface-container) text-(--on-surface-variant)",
  cerrado:      "bg-(--error-container) text-(--on-error-container)",
}

export const ClienteTable = ({ clientes, onEditar, onEliminar, onVerPanel }) => {
  const { tienePermiso } = useAuth()
  const puedeEditar   = tienePermiso("editar")
  const puedeEliminar = tienePermiso("eliminar")

  return (
    <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--outline-variant)/20">
          <thead className="bg-(--surface-container-low)">
            <tr>
              {["Cliente", "Contacto", "Estado", "Interacciones", "Oportunidades", "Agente", "Acciones"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--outline-variant)/10">
            {!clientes?.length ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-(--on-surface-variant) text-sm">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientes.map(cliente => (
                <tr key={cliente.id} className="hover:bg-(--surface-container-low) transition-colors">

                  {/* Cliente */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-(--surface-container) rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-(--on-surface-variant)">
                          {cliente.nombres?.[0]}
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onVerPanel(cliente)}
                          className="font-medium text-(--primary) text-sm hover:underline text-left"
                        >
                          {cliente.nombres} {cliente.apellidos}
                        </button>
                        <div className="text-xs text-(--on-surface-variant)">{cliente.codigo_cliente}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {cliente.email && (
                        <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                          <Mail className="w-3 h-3" />
                          {cliente.email}
                        </div>
                      )}
                      {cliente.telefono && (
                        <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                          <Phone className="w-3 h-3" />
                          {cliente.telefono}
                        </div>
                      )}
                      {cliente.whatsapp && (
                        <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                          <MessageCircle className="w-3 h-3" />
                          {cliente.whatsapp}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${ESTADO_COLORES[cliente.estado] || ""}`}>
                      {cliente.estado}
                    </span>
                  </td>

                  {/* Interacciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-(--on-surface)">
                      {cliente.total_interacciones}
                    </span>
                  </td>

                  {/* Oportunidades */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-medium text-(--on-surface)">
                      {cliente.total_oportunidades}
                    </span>
                  </td>

                  {/* Agente */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-(--on-surface-variant)">
                      {cliente.agente_principal || <span className="italic opacity-50">Sin asignar</span>}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EditButton onClick={() => onEditar(cliente)} disabled={!puedeEditar} />
                      <DeleteButton onClick={() => onEliminar(cliente)} disabled={!puedeEliminar} />
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