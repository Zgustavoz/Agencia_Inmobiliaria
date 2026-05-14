import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Search, TrendingUp, AlertCircle } from "lucide-react";
import { useAsignarAgentes } from "../hooks/useAsignarAgentes";
import { ClienteAgenteList } from "../components/ClienteAgenteList";
import { AsignarAgenteModal } from "../components/AsignarAgenteModal";
import ClientQuickAddModal from "../components/ClientQuickAddModal";
import ClientCompleteModal from "../components/ClientCompleteModal";

const ESTADO_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "nuevo", label: "Nuevo" },
  { value: "activo", label: "Activo" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "inactivo", label: "Inactivo" },
  { value: "cerrado", label: "Cerrado" }
];

export const AsignarAgentesPage = () => {
  const {
    clientesConAgentes,
    agentes,
    loading,
    error,
    searchQuery,
    filtroEstado,
    buscarClientes,
    filtrarPorEstado,
    asignarAgente,
    desasignarAgente,
    typeaheadSuggestions,
    buscarSugerencias,
    searchingSuggestions,
    crearClienteRapido,
    actualizarClientePartial
  } = useAsignarAgentes();

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [mostrarQuickAdd, setMostrarQuickAdd] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  const clientesSinAgente = clientesConAgentes.filter(c => !c.agente_asignado).length;
  const clientesConAgente = clientesConAgentes.filter(c => c.agente_asignado).length;
  const porcentajeAsignado = clientesConAgentes.length > 0
    ? Math.round((clientesConAgente / clientesConAgentes.length) * 100)
    : 0;

  const handleCambiarAgente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  const handleSeleccionarSugerencia = (sugerencia) => {
    // si tiene campos incompletos, abrir inline form
    if (sugerencia.incompleteFields && sugerencia.incompleteFields.length > 0) {
      setClienteParaEditar(sugerencia);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // abrir asignación directamente
      handleCambiarAgente(sugerencia);
    }
  };

  const handleAsignar = async (clienteId, agenteId) => {
    const resultado = await asignarAgente(clienteId, agenteId);
    if (resultado.success) {
      setMensajeExito("Agente asignado correctamente");
      setTimeout(() => setMensajeExito(null), 3000);
    }
    return resultado;
  };

  const handleDesasignar = async (clienteId) => {
    const resultado = await desasignarAgente(clienteId);
    if (resultado.success) {
      setMensajeExito("Agente desasignado correctamente");
      setTimeout(() => setMensajeExito(null), 3000);
    }
    return resultado;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Asignar Agentes a Clientes
            </h1>
          </div>
          <p className="text-gray-600 ml-4">Gestiona y asigna agentes responsables para cada cliente</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{clientesConAgentes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Clientes Asignados</p>
                <p className="text-3xl font-bold text-green-600">{clientesConAgente}</p>
                <p className="text-xs text-gray-500 mt-1">{porcentajeAsignado}% asignado</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Sin Asignar</p>
                <p className="text-3xl font-bold text-amber-600">{clientesSinAgente}</p>
                <p className="text-xs text-gray-500 mt-1">pendiente de asignación</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-8 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o código de cliente..."
                  value={searchQuery}
                  onChange={(e) => { buscarClientes(e.target.value); buscarSugerencias(e.target.value); }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {/* Suggestions dropdown */}
                <div className="relative">
                  {searchQuery && typeaheadSuggestions && typeaheadSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow z-20 max-h-64 overflow-y-auto">
                      {typeaheadSuggestions.map((s) => (
                        <button key={s.id} onClick={() => handleSeleccionarSugerencia(s)} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-gray-900">{s.nombre}</div>
                            <div className="text-xs text-gray-500">{s.email || "sin email"} • {s.codigo}</div>
                          </div>
                          {s.incompleteFields && s.incompleteFields.length > 0 && (
                            <div className="text-xs text-amber-600">Incompleto</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && (!typeaheadSuggestions || typeaheadSuggestions.length === 0) && (
                    <div className="absolute left-0 right-0 mt-2 flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 z-20">
                      <div className="text-sm text-gray-600">No hay coincidencias.</div>
                      <button onClick={() => setMostrarQuickAdd(true)} className="text-sm text-blue-600">Agregar cliente</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <select
                value={filtroEstado}
                onChange={(e) => filtrarPorEstado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ESTADO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {mensajeExito && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <div className="w-5 h-5 text-green-600 shrink-0 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-green-700">{mensajeExito}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ClienteAgenteList
            clientes={clientesConAgentes}
            loading={loading}
            onCambiarAgente={handleCambiarAgente}
          />
        </motion.div>
      </div>

      <AsignarAgenteModal
        isOpen={mostrarModal}
        cliente={clienteSeleccionado}
        agentes={agentes}
        onAsignar={handleAsignar}
        onDesasignar={handleDesasignar}
        onClose={() => {
          setMostrarModal(false);
          setClienteSeleccionado(null);
        }}
        onRequestComplete={(cliente) => {
          // cerrar modal y abrir inline editor para completar datos
          setMostrarModal(false);
          setClienteParaEditar(cliente);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        loading={loading}
        error={error}
      />

      <ClientQuickAddModal
        isOpen={mostrarQuickAdd}
        onClose={() => setMostrarQuickAdd(false)}
        onCreate={crearClienteRapido}
        loading={loading}
      />

      <ClientCompleteModal
        isOpen={!!clienteParaEditar}
        cliente={clienteParaEditar}
        onClose={() => setClienteParaEditar(null)}
        onSave={async (clienteId, data) => {
          const res = await actualizarClientePartial(clienteId, data);
          if (res.success) {
            // abrir modal de asignación para este cliente
            setClienteParaEditar(null);
            // cargar cliente actualizado como seleccionado
            setClienteSeleccionado(res.cliente);
            setMostrarModal(true);
          }
          return res;
        }}
        loading={loading}
      />
    </div>
  );
};

export default AsignarAgentesPage;
