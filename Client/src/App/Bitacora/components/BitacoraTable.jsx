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
        Bitácora del Sistema
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--outline-variant)">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Hora</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Detalle</th>
              <th className="p-3 text-left">IP</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr
                key={index}
                className="border-b border-(--outline-variant)/30 hover:bg-(--surface-container)"
              >
                <td className="p-3">{log.fecha}</td>
                <td className="p-3">{log.hora}</td>
                <td className="p-3">{log.usuario}</td>
                <td className="p-3">{log.detalle}</td>
                <td className="p-3">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionSection>
  )
}