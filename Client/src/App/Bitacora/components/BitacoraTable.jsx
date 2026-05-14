/* eslint-disable no-unused-vars */
import { motion } from "motion/react"

const getActionStyles = (accion) => {
  switch (accion) {
    case "LOGIN":
      return "bg-green-100 text-green-700"
    case "LOGOUT":
      return "bg-slate-100 text-slate-700"
    case "DELETE":
      return "bg-rose-100 text-rose-700"
    case "UPDATE":
      return "bg-amber-100 text-amber-700"
    case "CREATE":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-violet-100 text-violet-700"
  }
}

export const BitacoraTable = ({ logs }) => {
  const MotionSection = motion.section

  return (
    <MotionSection
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Actividad del sistema
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Revisa accesos, cambios y eventos registrados por módulo.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Fecha / Hora</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Módulo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acción</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Detalle</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">IP</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Dispositivo</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                  No se encontraron registros con los filtros aplicados.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id_actividad}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {new Date(log.fecha_evento).toLocaleDateString("es-BO")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.fecha_evento).toLocaleTimeString("es-BO")}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-blue-700">
                      {log.usuario_nombre || "Anónimo"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.entidad || "Sin entidad"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">{log.modulo || "-"}</div>
                    <div className="text-xs italic text-gray-500">{log.entidad || "-"}</div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${getActionStyles(log.accion)}`}
                    >
                      {log.accion}
                    </span>
                  </td>

                  <td className="max-w-[320px] px-4 py-4">
                    <div className="line-clamp-2 text-xs leading-5 text-gray-600" title={log.detalle}>
                      {log.detalle || "Sin detalle"}
                    </div>
                  </td>

                  <td className="px-4 py-4 font-mono text-xs text-gray-500">
                    {log.ip_origen || "-"}
                  </td>

                  <td className="max-w-[220px] px-4 py-4">
                    <div
                      className="truncate text-xs text-gray-500"
                      title={log.user_agent}
                    >
                      {log.user_agent || "No disponible"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MotionSection>
  )
}
