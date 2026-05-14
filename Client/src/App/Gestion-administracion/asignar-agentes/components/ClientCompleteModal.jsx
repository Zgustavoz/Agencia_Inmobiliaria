import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export const ClientCompleteModal = ({ isOpen, cliente, onClose, onSave, loading }) => {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", codigo: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        codigo: cliente.codigo || ""
      });
    }
  }, [cliente]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    if (!form.nombre) {
      setError("El nombre es requerido");
      return;
    }
    const res = await onSave(cliente.id, form);
    if (res.success) {
      onClose(res.cliente || res);
    } else {
      setError(res.error || "Error al actualizar cliente");
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
                  <h2 className="text-lg font-semibold text-gray-900">Completar Cliente</h2>
                  <p className="text-sm text-gray-500 mt-1">Completa los campos faltantes para poder asignar un agente</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onClose()}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              <div className="px-6 py-6 space-y-4">
                {error && <div className="text-sm text-red-600">{error}</div>}
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 border rounded-lg" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-lg" />
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full px-3 py-2 border rounded-lg" />
                <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código" className="w-full px-3 py-2 border rounded-lg" />

                <div className="flex gap-3">
                  <button onClick={() => onClose()} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientCompleteModal;
