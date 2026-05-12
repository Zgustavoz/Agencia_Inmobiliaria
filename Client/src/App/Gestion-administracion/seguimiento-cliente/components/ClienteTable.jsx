import { Mail, Phone, MessageCircle, User, Star, Activity, Briefcase, UserCheck } from "lucide-react"
import { EditButton, DeleteButton, ViewPanelButton } from "../../../../shared/ui/components/buttons"
import { useAuth } from "../../../auth/context/AuthContext"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const ESTADO_COLORES = {
  nuevo:        "bg-blue-100 text-blue-700",
  seguimiento:  "bg-yellow-100 text-yellow-700",
  activo:       "bg-green-100 text-green-700",
  inactivo:     "bg-gray-100 text-gray-600",
  cerrado:      "bg-red-100 text-red-700",
}

const ESTADO_ICONOS = {
  nuevo:        <Star className="w-3 h-3" />,
  seguimiento:  <Activity className="w-3 h-3" />,
  activo:       <UserCheck className="w-3 h-3" />,
  inactivo:     <User className="w-3 h-3" />,
  cerrado:      <Briefcase className="w-3 h-3" />,
}

export const ClienteTable = ({ clientes, onEditar, onEliminar, onVerPanel }) => {
  const { tienePermiso } = useAuth()
  const puedeEditar   = tienePermiso("clientes", "editar")
  const puedeEliminar = tienePermiso("clientes", "eliminar")
  const [hoveredRow, setHoveredRow] = useState(null)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {["Cliente", "Contacto", "Estado", "Interacciones", "Oportunidades", "Agente", "Acciones"].map((h, idx) => (
                <th 
                  key={h} 
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    idx === 6 ? "text-right" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    <span>{h}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {!clientes?.length ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">No hay clientes registrados</p>
                        <p className="text-gray-400 text-sm mt-1">Comienza agregando tu primer cliente</p>
                      </div>
                    </div>
                   </td>
                </motion.tr>
              ) : (
                clientes.map((cliente, idx) => (
                  <motion.tr 
                    key={cliente.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onMouseEnter={() => setHoveredRow(cliente.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-all duration-200 ${
                      hoveredRow === cliente.id 
                        ? "bg-blue-50/30 shadow-inner" 
                        : "bg-white hover:bg-gray-50/50"
                    }`}
                  >
                    {/* Cliente */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {cliente.nombres} {cliente.apellidos}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{cliente.codigo_cliente}</p>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        {cliente.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 group">
                            <Mail className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="truncate max-w-[200px]">{cliente.email}</span>
                          </div>
                        )}
                        {cliente.telefono && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 group">
                            <Phone className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-500 transition-colors" />
                            <span>{cliente.telefono}</span>
                          </div>
                        )}
                        {cliente.whatsapp && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 group">
                            <MessageCircle className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                            <span>{cliente.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${ESTADO_COLORES[cliente.estado] || "bg-gray-100 text-gray-600"}`}>
                        {ESTADO_ICONOS[cliente.estado] || <Activity className="w-3 h-3" />}
                        {cliente.estado?.charAt(0).toUpperCase() + cliente.estado?.slice(1)}
                      </span>
                    </td>

                    {/* Interacciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          cliente.total_interacciones > 0 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {cliente.total_interacciones || 0}
                        </div>
                      </div>
                    </td>

                    {/* Oportunidades */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          cliente.total_oportunidades > 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {cliente.total_oportunidades || 0}
                        </div>
                      </div>
                    </td>

                    {/* Agente */}
                    <td className="px-6 py-4">
                      {cliente.agente_principal ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {cliente.agente_principal}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sin asignar</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <ViewPanelButton onClick={() => onVerPanel(cliente)} />
                        <EditButton onClick={() => onEditar(cliente)} disabled={!puedeEditar} />
                        <DeleteButton onClick={() => onEliminar(cliente)} disabled={!puedeEliminar} />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Footer simple con estadísticas */}
      {clientes?.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>📊 Total: {clientes.length} clientes</span>
              <span>✅ Activos: {clientes.filter(c => c.estado === "activo").length}</span>
              <span>🆕 Nuevos: {clientes.filter(c => c.estado === "nuevo").length}</span>
              <span>📞 Seguimiento: {clientes.filter(c => c.estado === "seguimiento").length}</span>
            </div>
            <div>
              <span>💬 {clientes.reduce((sum, c) => sum + (c.total_interacciones || 0), 0)} interacciones</span>
              <span className="ml-4">🎯 {clientes.reduce((sum, c) => sum + (c.total_oportunidades || 0), 0)} oportunidades</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
