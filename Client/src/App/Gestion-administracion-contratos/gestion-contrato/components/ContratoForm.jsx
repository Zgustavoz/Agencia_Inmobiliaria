import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import {
  createContrato,
  updateContrato,
  buscarClientes,
  buscarAgentes,
  buscarPropiedades,
} from "../api/contratoApi";

export const ContratoForm = ({ onCancel, onSuccess, contratoAEditar }) => {
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
    propiedad: null,
  });

  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

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
        propiedad: contratoAEditar.propiedad || null,
      });
    }
  }, [contratoAEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Filtro estricto: Solo permite números y un único punto decimal para finanzas
    if (name === "garantia" || name === "comision") {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        return; // Ignora el tipeo si no es un número válido
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const normalizarTipoOperacion = (modalidad) => {
    if (!modalidad) return "";
    const mod = modalidad.toUpperCase();

    if (mod.includes("VEND") || mod.includes("VENTA")) return "VENTA";
    if (mod.includes("ALQUIL")) return "ALQUILER";
    if (mod.includes("ANTICR")) return "ANTICRETICO";

    return mod;
  };

  const loadClientes = async (input) => {
    const data = await buscarClientes(input);
    return data.map((c) => ({
      value: c.id,
      label: c.nombre,
    }));
  };

  const loadAgentes = async (input) => {
    const data = await buscarAgentes(input);
    return data.map((a) => ({
      value: a.id,
      label: a.nombre,
    }));
  };

  const loadPropiedades = async (input) => {
    const data = await buscarPropiedades(input);
    return data.map((p) => {
      const imagenPrincipal =
        p.imagenes?.find((img) => img.principal)?.url_imagen ||
        p.imagenes?.[0]?.url_imagen ||
        null;

      return {
        value: p.id_propiedad || p.id,
        label: `${p.codigo_propiedad || p.nombre} - ${p.modalidad_operacion}`,
        modalidad_operacion: p.modalidad_operacion,
        precio: p.precio,
        agente_id: p.agente_id,
        imagen_url: imagenPrincipal,
        ubicacion: `${p.nombre_zona || ""}, ${p.zona_ciudad || ""}`,
        codigo: p.codigo_propiedad,
      };
    });
  };

  const imprimirContratoDesdeFrontend = (contrato, propiedad) => {
    const ventanaImpresion = window.open("", "_blank");

    const fechaInicio = contrato.fecha_inicio
      ? new Date(contrato.fecha_inicio).toLocaleDateString()
      : "--";
    const fechaFin = contrato.fecha_fin
      ? new Date(contrato.fecha_fin).toLocaleDateString()
      : "--";
    const fechaHoy = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const htmlContenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contrato Real Estate - ${contrato.codigo_contrato || "CTR"}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-title { color: #1e3a8a; font-size: 28px; font-weight: bold; margin: 0; }
          .contrato-codigo { font-size: 16px; color: #64748b; font-weight: normal; }
          .badge { background-color: #e0f2fe; color: #0369a1; padding: 4px 12px; font-size: 14px; font-weight: bold; text-transform: uppercase; border-radius: 4px; }
          .seccion { margin-bottom: 25px; }
          .seccion-titulo { font-size: 16px; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .campo { margin-bottom: 8px; font-size: 14px; }
          .label { font-weight: bold; color: #475569; }
          .destacado { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .monto { font-size: 20px; color: #15803d; font-weight: bold; }
          .firmas { margin-top: 80px; display: flex; justify-content: space-around; }
          .firma-box { text-align: center; width: 200px; border-top: 1px solid #94a3b8; padding-top: 10px; font-size: 14px; color: #475569; }
          @media print { body { padding: 0; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="logo-title">AGENCIA INMOBILIARIA</h1>
            <div class="contrato-codigo">Documento de Contrato de Operación</div>
          </div>
          <div>
            <span class="badge">${contrato.tipo_operacion || "OPERACIÓN"}</span>
          </div>
        </div>

        <div class="seccion">
          <div class="seccion-titulo">1. Información del Contrato</div>
          <div class="grid">
            <div class="campo"><span class="label">Código de Contrato:</span> ${contrato.codigo_contrato || "--"}</div>
            <div class="campo"><span class="label">Estado Actual:</span> ${contrato.estado_contrato || "BORRADOR"}</div>
            <div class="campo"><span class="label">Fecha de Inicio:</span> ${fechaInicio}</div>
            <div class="campo"><span class="label">Fecha de Vencimiento:</span> ${fechaFin}</div>
          </div>
        </div>

        <div class="seccion">
          <div class="seccion-titulo">2. Detalles de la Propiedad</div>
          <div class="destacado">
            <div class="campo"><span class="label">Código Propiedad:</span> ${propiedad?.codigo || "--"}</div>
            <div class="campo"><span class="label">Ubicación / Zona:</span> ${propiedad?.ubicacion || "No especificada"}</div>
          </div>
        </div>

        <div class="seccion">
          <div class="seccion-titulo">3. Condiciones Financieras</div>
          <div class="grid">
            <div class="campo"><span class="label">Monto de la Operación:</span> <span class="monto">$ ${contrato.monto || "0.00"}</span></div>
            <div class="campo"><span class="label">Garantía Depuesta:</span> $ ${contrato.garantia || "0.00"}</div>
            <div class="campo"><span class="label">Comisión Establecida:</span> ${contrato.comision}%</div>
          </div>
        </div>

        <div class="seccion" style="margin-top: 30px;">
          <div class="seccion-titulo">4. Cláusulas y Condiciones Especiales</div>
          <div class="campo" style="white-space: pre-wrap; font-style: italic;">${contrato.condiciones || "Las partes se someten a las condiciones generales reguladas por la legislación vigente de arrendamientos e inmuebles."}</div>
        </div>

        ${
          contrato.observaciones
            ? `
        <div class="seccion">
          <div class="seccion-titulo">Observaciones Adicionales</div>
          <div class="campo" style="white-space: pre-wrap; color: #64748b;">${contrato.observaciones}</div>
        </div>`
            : ""
        }

        <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: right;">Documento generado el ${fechaHoy}</p>

        <div class="firmas">
          <div class="firma-box">Firma del Cliente</div>
          <div class="firma-box">Agente Responsable</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    ventanaImpresion.document.write(htmlContenido);
    ventanaImpresion.document.close();
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      let response;

      if (contratoAEditar) {
        response = await updateContrato(contratoAEditar.id_contrato, payload);
      } else {
        response = await createContrato(payload);
      }

      console.log("✅ Guardado en Backend con éxito:", response);

      const contratoFinal = { ...formData, ...response };
      imprimirContratoDesdeFrontend(contratoFinal, propiedadSeleccionada);
      onSuccess();
    } catch (error) {
      console.error("Error guardando contrato:", error.response?.data || error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-700 text-3xl">
              description
            </span>
            <h2 className="text-2xl font-bold text-blue-800">
              {contratoAEditar ? "Editar Contrato" : "Nuevo Contrato"}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Formulario Principal */}
            <div className="lg:col-span-8 space-y-6">
              {/* Sección 1: Identificación */}
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-blue-600">
                    badge
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Identificación del Contrato
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Código de Contrato
                    </label>
                    <input
                      name="codigo_contrato"
                      value={formData.codigo_contrato}
                      onChange={handleChange}
                      placeholder="Ej. CTR-001"
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Estado
                    </label>
                    <select
                      name="estado_contrato"
                      value={formData.estado_contrato}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="BORRADOR">Borrador</option>
                      <option value="ACTIVO">Activo</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="VENCIDO">Vencido</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Sección 2: Entidades */}
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-blue-600">
                    groups
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Entidades Relacionadas
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Cliente
                      </label>
                      <AsyncSelect
                        loadOptions={loadClientes}
                        placeholder="Buscar Cliente..."
                        defaultOptions
                        onChange={(v) =>
                          setFormData({ ...formData, cliente: v.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Agente Responsable
                      </label>
                      <AsyncSelect
                        loadOptions={loadAgentes}
                        placeholder="Buscar Agente..."
                        defaultOptions
                        onChange={(v) =>
                          setFormData({ ...formData, agente: v.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">
                        Propiedad
                      </label>
                      <AsyncSelect
                        loadOptions={loadPropiedades}
                        placeholder="Buscar Propiedad..."
                        defaultOptions
                        onChange={(v) => {
                          setFormData((prev) => ({
                            ...prev,
                            propiedad: v.value,
                            tipo_operacion: normalizarTipoOperacion(
                              v.modalidad_operacion,
                            ),
                            monto: v.precio || "",
                            agente: v.agente_id ? v.agente_id : prev.agente,
                          }));
                          setPropiedadSeleccionada(v);
                        }}
                        className="text-sm"
                      />

                      {propiedadSeleccionada && (
                        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-lg flex gap-4 items-center shadow-sm">
                          <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-slate-200 border border-slate-300">
                            {propiedadSeleccionada.imagen_url ? (
                              <img
                                src={propiedadSeleccionada.imagen_url}
                                alt="Propiedad"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-3xl">
                                  image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-900">
                              {propiedadSeleccionada.codigo}
                            </span>
                            <span className="text-sm text-slate-700 flex items-center gap-1 mt-1">
                              <span className="material-symbols-outlined text-sm">
                                location_on
                              </span>
                              {propiedadSeleccionada.ubicacion}
                            </span>
                            <span className="text-sm text-slate-700 flex items-center gap-1 mt-1">
                              <span className="material-symbols-outlined text-sm">
                                payments
                              </span>
                              {propiedadSeleccionada.precio}{" "}
                              <span className="font-semibold text-blue-700">
                                ({formData.tipo_operacion})
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 3: Plazos y Finanzas */}
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-blue-600">
                    payments
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Condiciones Financieras y Plazos
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Monto Final
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                        $
                      </span>
                      <input
                        name="monto"
                        value={formData.monto}
                        readOnly
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border rounded-lg border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Garantía
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                        $
                      </span>
                      <input
                        name="garantia"
                        value={formData.garantia}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Comisión
                    </label>
                    <div className="relative">
                      <input
                        name="comision"
                        value={formData.comision}
                        onChange={handleChange}
                        placeholder="Ej. 5"
                        className="w-full pl-3 pr-7 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 text-right font-medium"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </section>

              {/* Sección 4: Textos Largos */}
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-blue-600">
                    edit_note
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Detalles Adicionales
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Condiciones Especiales
                    </label>
                    <textarea
                      name="condiciones"
                      value={formData.condiciones}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Especifique las condiciones del contrato..."
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Notas internas u observaciones..."
                      className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Barra inferior adhesiva */}
              <div className="sticky bottom-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-lg">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-700 text-white text-base font-semibold rounded-lg hover:bg-blue-800 transition-all shadow-md active:scale-95"
                >
                  Guardar Contrato
                </button>
              </div>
            </div>

            {/* Columna Derecha: Guía y Resumen */}
            <div className="lg:col-span-4 sticky top-6 space-y-6">
              <div className="bg-blue-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-2 mb-3 relative">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <h4 className="text-lg font-semibold">Guía del Experto</h4>
                </div>
                <div className="space-y-3 text-sm opacity-90 relative">
                  <p>
                    Estás creando un contrato mediante el sistema inteligente.
                  </p>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="font-bold mb-1">💡 Autocompletado:</p>
                    <p>
                      Al seleccionar una propiedad, el monto, el agente y el
                      tipo de operación se llenarán solos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                  Resumen en Vivo
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-slate-200 border-dotted pb-1">
                    <span className="text-sm text-slate-500">Código</span>
                    <span className="font-medium text-slate-800">
                      {formData.codigo_contrato || "--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 border-dotted pb-1">
                    <span className="text-sm text-slate-500">Operación</span>
                    <span className="font-medium text-slate-800">
                      {formData.tipo_operacion || "--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 border-dotted pb-1">
                    <span className="text-sm text-slate-500">Estado</span>
                    <span className="font-medium text-slate-800">
                      {formData.estado_contrato}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-200 border-dotted pb-1">
                    <span className="text-sm text-slate-500">Monto</span>
                    <span className="font-medium text-blue-700 font-bold">
                      ${" "}
                      {formData.monto
                        ? Number(formData.monto).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
