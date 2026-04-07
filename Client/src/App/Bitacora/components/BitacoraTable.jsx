/* eslint-disable no-unused-vars */
import { motion } from "motion/react"

export const BitacoraTable = ({ logs }) => {
  const MotionSection = motion.section

  return (
    <MotionSection
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full rounded-xl border border-(--outline-variant)/40 bg-(--surface-container-lowest) p-6 shadow-[0px_12px_32px_rgba(27,28,28,0.08)]"
    >
      <h2 className="mb-4 text-xl font-bold text-(--on-surface)">
        Bitácora Detallada del Sistema
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--outline-variant) bg-(--surface-container-low)">
              <th className="p-3 text-left">Fecha / Hora</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Módulo/Entidad</th>
              <th className="p-3 text-left">Acción</th>
              <th className="p-3 text-left">Detalle</th>
              <th className="p-3 text-left">IP</th>
              <th className="p-3 text-left">Dispositivo</th> {/* <-- Nueva columna */}
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id_actividad} className="border-b border-(--outline-variant)/30 hover:bg-(--surface-container) transition-colors">
                <td className="p-3 whitespace-nowrap">
                   <div className="font-medium text-(--on-surface)">{new Date(log.fecha_evento).toLocaleDateString()}</div>
                   <div className="text-xs text-(--on-surface-variant)">{new Date(log.fecha_evento).toLocaleTimeString()}</div>
                </td>
                
                <td className="p-3 font-semibold text-blue-600">
                  {log.usuario_nombre || 'Anónimo'}
                </td>
                
                <td className="p-3 text-xs">
                  <div className="font-bold text-(--primary)">{log.modulo}</div>
                  <div className="text-gray-500 italic">{log.entidad}</div>
                </td>
                
                <td className="p-3">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                     log.accion === 'LOGIN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                   }`}>
                    {log.accion}
                   </span>
                </td>
                
                <td className="p-3 max-w-[200px] truncate text-xs" title={log.detalle}>
                  {log.detalle}
                </td>
                
                <td className="p-3 font-mono text-[10px] text-gray-500">
                  {log.ip_origen}
                </td>

                {/* CELDA DEL USER AGENT */}
                <td className="p-3">
                  <div 
                    className="max-w-[120px] truncate text-[10px] text-gray-400 cursor-help" 
                    title={log.user_agent} // Esto muestra el texto completo al pasar el mouse
                  >
                    {log.user_agent}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionSection>
  )
}