import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, AlertCircle, Trash2 } from "lucide-react";

export const AsignarAgenteModal = ({
  isOpen,
  cliente,
  agentes,
  onAsignar,
  onDesasignar,
  onClose,
  loading,
  error
  , onRequestComplete
}) => {
  const [agenteSeleccionado, setAgenteSeleccionado] = useState(
    cliente?.agente_asignado || null
  );
  const [mensaje, setMensaje] = useState(null);

  const camposIncompletos = (() => {
    if (!cliente) return [];
    const campos = [];
    if (!cliente.nombre) campos.push("nombre");
    if (!cliente.email) campos.push("email");
    if (!cliente.telefono) campos.push("telefono");
    if (!cliente.codigo) campos.push("codigo");
    return campos;
  })();

  const handleAsignar = async () => {
    if (!agenteSeleccionado) return;
    const resultado = await onAsignar(cliente?.id || 1, agenteSeleccionado);
    if (resultado.success) {
      setMensaje({ tipo: "success", texto: "Agente asignado correctamente" });
      setTimeout(() => {
        onClose();
        setMensaje(null);
      }, 1500);
    } else {
      setMensaje({ tipo: "error", texto: resultado.error || "Error al asignar agente" });
    }
  };

  const handleDesasignar = async () => {
    const resultado = await onDesasignar(cliente?.id || 1);
    if (resultado.success) {
      setMensaje({ tipo: "success", texto: "Agente desasignado correctamente" });
      setTimeout(() => {
        onClose();
        setMensaje(null);
      }, 1500);
    } else {
      setMensaje({ tipo: "error", texto: resultado.error || "Error al desasignar agente" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Asignar Agente</h2>
                  <p className="text-sm text-gray-500 mt-1">{cliente?.nombre}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              <div className="px-6 py-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                {mensaje ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-center py-8 ${mensaje.tipo === "success" ? "text-green-600" : "text-red-600"}`}
                  >
                    {mensaje.tipo === "success" ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                        <Check className="w-12 h-12 mx-auto mb-2" />
                      </motion.div>
                    ) : (
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    )}
                    <p className="font-medium">{mensaje.texto}</p>
                  </motion.div>
                ) : (
                  <>
                    {camposIncompletos.length > 0 && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                        <div className="text-sm text-amber-700">No puedes asignar un agente hasta completar: {camposIncompletos.join(", ")}</div>
                        <div>
                          <button
                            onClick={() => {
                              // pedir al parent que abra el editor inline
                              if (onRequestComplete) onRequestComplete(cliente);
                            }}
                            className="text-sm text-amber-700 underline"
                          >
                            Completar datos
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3 mb-6">
                      <label className="text-sm font-medium text-gray-700">Selecciona un agente</label>
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        <AnimatePresence>
                          {agentes.map((agente, index) => (
                            <motion.button
                              key={agente.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() =>
                                setAgenteSeleccionado(agenteSeleccionado === agente.id ? null : agente.id)
                              }
                              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${agenteSeleccionado === agente.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 bg-gray-50"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${agente.avatar_color} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                                >
                                  {agente.nombre.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-gray-900">
                                    {agente.nombre} {agente.apellido}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">{agente.email}</p>
                                </div>
                                {agenteSeleccionado === agente.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="shrink-0"
                                  >
                                    <Check className="w-5 h-5 text-blue-600" />
                                  </motion.div>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAsignar}
                        disabled={loading || !agenteSeleccionado || camposIncompletos.length > 0}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Asignando..." : "Asignar"}
                      </motion.button>
                    </div>

                    {cliente?.agente_asignado && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDesasignar}
                        disabled={loading}
                        className="w-full mt-3 px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Desasignar Agente
                      </motion.button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
