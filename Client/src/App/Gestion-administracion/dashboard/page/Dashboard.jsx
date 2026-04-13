import { motion } from "motion/react"
import { Users, Shield, Activity } from "lucide-react"

import { useUsuario } from "../../gestion-usuario/hooks/useUsuario"

export const DashboardPage = () => {
  const { usuarios } = useUsuario()

  const data = usuarios?.data?.results ?? usuarios?.data ?? []

  const stats = [
    {
      label: "Usuarios Totales",
      value: data.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Usuarios Activos",
      value: data.filter(u => u.is_active !== false).length,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      label: "Roles en sistema",
      value: new Set(data.map(u => u.rol || u.role || "Usuario")).size,
      icon: Shield,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Dashboard Administrativo
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow p-4 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl text-white ${item.color}`}>
                <Icon size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-lg font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Lista de usuarios preview */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold text-gray-700 mb-4">
          Usuarios recientes
        </h2>

        <div className="space-y-3">
          {data.slice(0, 5).map((u, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {u.nombre || u.username}
                </p>
                <p className="text-xs text-gray-500">
                  {u.email}
                </p>
              </div>

              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {u.rol || "Usuario"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}