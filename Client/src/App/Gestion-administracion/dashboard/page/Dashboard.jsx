import { motion } from "motion/react"
import { Users, Shield, Activity, Building2, FileText, Calendar, TrendingUp } from "lucide-react"

import { useUsuario } from "../../gestion-usuario/hooks/useUsuario"

export const DashboardPage = () => {
  const { usuarios } = useUsuario()

  const data = usuarios?.data?.results ?? usuarios?.data ?? []

  const stats = [
    {
      label: "Propiedades",
      value: "23",
      icon: Building2,
      color: "bg-linear-to-br from-blue-500 to-blue-600",
      trend: "+3 este mes",
    },
    {
      label: "Clientes",
      value: "156",
      icon: Users,
      color: "bg-linear-to-br from-green-500 to-green-600",
      trend: "+12 este mes",
    },
    {
      label: "Contratos Activos",
      value: "8",
      icon: FileText,
      color: "bg-linear-to-br from-purple-500 to-purple-600",
      trend: "+2 en curso",
    },
    {
      label: "Visitas Programadas",
      value: "15",
      icon: Calendar,
      color: "bg-linear-to-br from-amber-500 to-amber-600",
      trend: "Esta semana",
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu actividad y métricas</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5rgba(0,0,0,0.1)" }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                </div>
                <div className={`p-3 rounded-lg text-white ${item.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <TrendingUp size={14} />
                {item.trend}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow p-6 border border-gray-100"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h2>

        <div className="space-y-3">
          {[
            { action: 'Nueva propiedad agregada', time: 'hace 2 horas', user: 'Juan Pérez' },
            { action: 'Visita programada confirmada', time: 'hace 5 horas', user: 'María García' },
            { action: 'Contrato firmado', time: 'hace 1 día', user: 'Carlos López' },
            { action: 'Cliente asignado a propiedad', time: 'hace 2 días', user: 'Sistema' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.action}</p>
                <p className="text-xs text-gray-500">{item.user}</p>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}