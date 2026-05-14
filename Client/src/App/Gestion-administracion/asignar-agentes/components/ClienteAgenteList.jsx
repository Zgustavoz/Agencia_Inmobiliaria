import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, Tag, Edit2, AlertCircle } from "lucide-react";

const estadoBadges = {
  nuevo: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  activo: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  seguimiento: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  inactivo: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-500" },
  cerrado: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" }
};

export const ClienteAgenteList = ({ clientes, loading, onCambiarAgente }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No se encontraron coincidencias</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros parámetros de búsqueda</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Agente Asignado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {clientes.map((cliente, index) => (
                <motion.tr
                  key={cliente.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{cliente.nombre}</p>
                      <p className="text-xs text-gray-500">{cliente.codigo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {cliente.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${estadoBadges[cliente.estado].bg} ${estadoBadges[cliente.estado].text}`}>
                      <span className={`w-2 h-2 rounded-full ${estadoBadges[cliente.estado].dot}`}></span>
                      {cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {cliente.agente_info ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${cliente.agente_info.avatar_color} text-white flex items-center justify-center text-xs font-bold`}>
                          {cliente.agente_info.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{cliente.agente_info.nombre}</p>
                          <p className="text-xs text-gray-500">{cliente.agente_info.apellido}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCambiarAgente(cliente)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Cambiar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200">
        <AnimatePresence>
          {clientes.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{cliente.nombre}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Tag className="w-3 h-3" />
                    {cliente.codigo}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoBadges[cliente.estado].bg} ${estadoBadges[cliente.estado].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${estadoBadges[cliente.estado].dot}`}></span>
                  {cliente.estado}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {cliente.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {cliente.telefono}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                {cliente.agente_info ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${cliente.agente_info.avatar_color} text-white flex items-center justify-center text-xs font-bold`}>
                        {cliente.agente_info.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-xs text-gray-900">{cliente.agente_info.nombre}</p>
                        <p className="text-xs text-gray-500">{cliente.agente_info.apellido}</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCambiarAgente(cliente)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Sin asignar</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCambiarAgente(cliente)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
