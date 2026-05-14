import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export const ClientInlineForm = ({ cliente, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({ nombre: "", codigo: "", email: "", telefono: "" });

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre || "",
        codigo: cliente.codigo || "",
        email: cliente.email || "",
        telefono: cliente.telefono || ""
      });
    }
  }, [cliente]);

  if (!cliente) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const res = await onSave(cliente.id, form);
    if (res.success) {
      // nothing more here; parent will refresh
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium">Editar Cliente: {cliente.nombre}</p>
          <p className="text-xs text-gray-500">Completa los campos faltantes</p>
        </div>
        <button onClick={onCancel} className="text-sm text-gray-500">Cerrar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 border rounded-lg" />
        <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código" className="w-full px-3 py-2 border rounded-lg" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-lg" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full px-3 py-2 border rounded-lg" />
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancelar</button>
        <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </motion.div>
  );
};

export default ClientInlineForm;
