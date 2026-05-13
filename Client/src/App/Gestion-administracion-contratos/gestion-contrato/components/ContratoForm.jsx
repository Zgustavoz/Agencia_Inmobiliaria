import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import {
  createContrato,
  updateContrato,
  buscarClientes,
  buscarAgentes,
  buscarPropiedades
} from "../api/contratoApi";

export const ContratoForm = ({
  onCancel,
  onSuccess,
  contratoAEditar
}) => {
  const [formData, setFormData] = useState({
    codigo_contrato: "",
    estado_contrato: "BORRADOR",
    tipo_operacion: "",
    monto: "",
    garantia: "",
    comision: "",
    fecha_inicio: "",
    fecha_fin: "",
    condiciones: "",
    observaciones: "",
    cliente: null,
    agente: null,
    propiedad: null
  });

  useEffect(() => {
    if (contratoAEditar) {
      setFormData({
        codigo_contrato: contratoAEditar.codigo_contrato || "",
        estado_contrato: contratoAEditar.estado_contrato || "BORRADOR",
        tipo_operacion: contratoAEditar.tipo_operacion || "",
        monto: contratoAEditar.monto || "",
        garantia: contratoAEditar.garantia || "",
        comision: contratoAEditar.comision || "",
        fecha_inicio: contratoAEditar.fecha_inicio || "",
        fecha_fin: contratoAEditar.fecha_fin || "",
        condiciones: contratoAEditar.condiciones || "",
        observaciones: contratoAEditar.observaciones || "",
        cliente: contratoAEditar.cliente || null,
        agente: contratoAEditar.agente || null,
        propiedad: contratoAEditar.propiedad || null
      });
    }
  }, [contratoAEditar]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loadClientes = async (input) => {
    const data = await buscarClientes(input);

    return data.map((c) => ({
      value: c.id,
      label: c.nombre
    }));
  };

  const loadAgentes = async (input) => {
    const data = await buscarAgentes(input);

    return data.map((a) => ({
      value: a.id,
      label: a.nombre
    }));
  };

  const loadPropiedades = async (input) => {
    const data = await buscarPropiedades(input);

    return data.map((p) => ({
      value: p.id_propiedad || p.id,
      label: p.codigo_propiedad || p.nombre
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        garantia: formData.garantia ? Number(formData.garantia) : null,
        monto: formData.monto ? Number(formData.monto) : null,
        comision: formData.comision ? Number(formData.comision) : null,
      };

      if (contratoAEditar) {
        await updateContrato(contratoAEditar.id_contrato, payload);
      } else {
        await createContrato(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Error guardando contrato:", error.response?.data);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-neutral-100">

      <h2 className="text-2xl font-bold mb-8 text-neutral-800">
        {contratoAEditar
          ? "Editar Contrato"
          : "Nuevo Contrato"}
      </h2>

      <div className="grid grid-cols-2 gap-5">

        <input
          name="codigo_contrato"
          value={formData.codigo_contrato}
          placeholder="Código"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

        <select
          name="estado_contrato"
          value={formData.estado_contrato}
          onChange={handleChange}
          className="p-3 rounded-lg border"
        >
          <option value="BORRADOR">Borrador</option>
          <option value="ACTIVO">Activo</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="VENCIDO">Vencido</option>
        </select>
        
        <select
          name="tipo_operacion"
          value={formData.tipo_operacion}
          onChange={handleChange}
          className="p-3 rounded-lg border"
        >
          <option value="">Tipo de operación</option>
          <option value="VENTA">Venta</option>
          <option value="ALQUILER">Alquiler</option>
          <option value="ANTICRETICO">Anticrético</option>
        </select>

        <AsyncSelect
          loadOptions={loadClientes}
          placeholder="Buscar Cliente..."
          defaultOptions
          onChange={(v) =>
            setFormData({
              ...formData,
              cliente: v.value
            })
          }
        />

        <AsyncSelect
          loadOptions={loadAgentes}
          placeholder="Buscar Agente..."
          defaultOptions
          onChange={(v) =>
            setFormData({
              ...formData,
              agente: v.value
            })
          }
        />

        <AsyncSelect
          loadOptions={loadPropiedades}
          placeholder="Buscar Propiedad..."
          defaultOptions
          onChange={(v) =>
            setFormData({
              ...formData,
              propiedad: v.value
            })
          }
        />

        <input
          name="monto"
          value={formData.monto}
          placeholder="Monto"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

        <input
          name="garantia"
          value={formData.garantia}
          placeholder="Garantía"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

        <input
          name="comision"
          value={formData.comision}
          placeholder="Comisión"
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          className="p-3 rounded-lg border"
        />

      </div>

      <textarea
        name="condiciones"
        value={formData.condiciones}
        placeholder="Condiciones"
        onChange={handleChange}
        className="w-full mt-5 p-3 rounded-lg border"
      />

      <textarea
        name="observaciones"
        value={formData.observaciones}
        placeholder="Observaciones"
        onChange={handleChange}
        className="w-full mt-5 p-3 rounded-lg border"
      />

      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-5 py-2 border rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-[#0052CC] text-white rounded-lg"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};