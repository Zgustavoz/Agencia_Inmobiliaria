import { useState, useEffect } from "react";
import {
  Search,
  User,
  Phone,
  Mail,
  History,
  Calendar,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { m, AnimatePresence } from "motion/react";

// Importamos tus funciones de API
import {
  getVisitas,
  getClientes,
  getClienteDetalle,
} from "../../gestion-visitas/api/visitaApi";

export const ClientesHistorialPage = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [historialCombinado, setHistorialCombinado] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar lista de clientes (Panel Izquierdo)
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes({ search: searchTerm });
        setClientes(data.results || []); // Ajuste por paginación de Django
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, [searchTerm]);

  // 2. Función para cargar detalle y visitas cuando se selecciona un cliente
  const handleSeleccionarCliente = async (clienteBase) => {
    setLoading(true);
    try {
      // Peticiones paralelas para optimizar
      const [detalle, visitasData] = await Promise.all([
        getClienteDetalle(clienteBase.id),
        getVisitas({ cliente_id: clienteBase.id }),
      ]);

      // NORMALIZACIÓN: Unimos interacciones del backend y visitas para el timeline
      const interaccionesNorm = (detalle.interacciones || []).map((i) => ({
        id: `int-${i.id}`,
        tipo: i.tipo, // 'consulta', 'visita', 'llamada', etc (tus CHOICES de Django)
        fecha: i.creado_en,
        titulo: i.asunto || "Sin asunto",
        observacion: i.detalle,
        agente: i.agente_nombre,
      }));

      const visitasNorm = (visitasData.results || visitasData).map((v) => ({
        id: `vis-${v.id_visita}`,
        tipo: "visita_propiedad", // Tipo especial para el icono
        fecha: v.fecha_visita,
        titulo: `Visita: ${v.propiedad_titulo}`,
        observacion: v.comentario_agente || "Visita programada",
        agente: v.agente_nombre,
      }));

      // Unir y ordenar por fecha descendente
      const fullHistorial = [...interaccionesNorm, ...visitasNorm].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha),
      );

      setSelectedCliente(detalle);
      setHistorialCombinado(fullHistorial);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ayudantes de UI actualizados a tus CHOICES del backend
  const getIconoInteraccion = (tipo) => {
    switch (tipo) {
      case "visita_propiedad":
        return <Calendar size={16} className="text-blue-600" />;
      case "llamada":
        return <PhoneCall size={16} className="text-green-600" />;
      case "mensaje":
      case "whatsapp":
        return <MessageSquare size={16} className="text-amber-600" />;
      case "email":
        return <Mail size={16} className="text-purple-600" />;
      default:
        return <History size={16} className="text-gray-600" />;
    }
  };

  const getBadgeInteraccion = (tipo) => {
    const styles = {
      visita_propiedad: "bg-blue-100 border-blue-200 text-blue-700",
      llamada: "bg-green-100 border-green-200 text-green-700",
      whatsapp: "bg-emerald-100 border-emerald-200 text-emerald-700",
      mensaje: "bg-amber-100 border-amber-200 text-amber-700",
      email: "bg-purple-100 border-purple-200 text-purple-700",
    };
    return styles[tipo] || "bg-gray-100 border-gray-200 text-gray-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-(--on-surface) tracking-tight">
          Seguimiento de Clientes
        </h1>
        <p className="text-sm text-(--on-surface-variant)">
          Historial unificado de interacciones y visitas
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PANEL IZQUIERDO */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--on-surface-variant) opacity-50"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o código..."
              className="w-full pl-9 pr-4 py-2.5 bg-(--surface-container-lowest) border border-(--outline-variant)/20 rounded-xl text-sm outline-none focus:border-(--primary)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {clientes.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => handleSeleccionarCliente(cliente)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                  selectedCliente?.id === cliente.id
                    ? "bg-(--primary) border-(--primary) shadow-md"
                    : "bg-(--surface-container-lowest) border-(--outline-variant)/20 hover:border-(--primary)/40"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${selectedCliente?.id === cliente.id ? "bg-white/20" : "bg-(--primary-container)"}`}
                >
                  <User
                    size={24}
                    className={
                      selectedCliente?.id === cliente.id
                        ? "text-white"
                        : "text-(--primary)"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold truncate ${selectedCliente?.id === cliente.id ? "text-white" : "text-(--on-surface)"}`}
                  >
                    {cliente.nombres} {cliente.apellidos}
                  </p>
                  <p
                    className={`text-[10px] uppercase font-bold opacity-80 mt-0.5 ${selectedCliente?.id === cliente.id ? "text-white/80" : "text-(--on-surface-variant)"}`}
                  >
                    {cliente.codigo_cliente} • {cliente.estado}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className={
                    selectedCliente?.id === cliente.id
                      ? "text-white"
                      : "text-neutral-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="lg:col-span-8">
          {selectedCliente ? (
            <m.div
              key={selectedCliente.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-(--surface-container-lowest) rounded-3xl border border-(--outline-variant)/20 shadow-sm overflow-hidden"
            >
              {/* Header con gradiente usando tus variables */}
              <div className="p-8 bg-gradient-to-r from-(--primary) to-(--primary-container) text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white">
                      <User size={40} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedCliente.nombres} {selectedCliente.apellidos}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase mt-2">
                        <CheckCircle2 size={12} /> {selectedCliente.estado}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 bg-black/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone size={14} className="opacity-70" />{" "}
                      {selectedCliente.telefono || "Sin teléfono"}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Mail size={14} className="opacity-70" />{" "}
                      {selectedCliente.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Dinámico */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-(--on-surface) uppercase tracking-wider flex items-center gap-2">
                    <History size={18} className="text-(--primary)" /> Historial
                    Completo
                  </h3>
                </div>

                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-(--outline-variant)/20">
                  <AnimatePresence mode="popLayout">
                    {historialCombinado.map((item, idx) => (
                      <m.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative flex items-center gap-8 pl-10 group"
                      >
                        {/* Icono del Timeline */}
                        <div className="absolute left-0 w-10 h-10 rounded-full border-4 border-(--surface-container-lowest) bg-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                          {getIconoInteraccion(item.tipo)}
                        </div>

                        {/* Tarjeta del Historial */}
                        <div className="flex-1 p-5 rounded-2xl border border-(--outline-variant)/20 bg-(--surface-container-lowest) hover:border-(--primary)/30 transition-shadow shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getBadgeInteraccion(item.tipo)}`}
                            >
                              {item.tipo.replace("_", " ")}
                            </span>
                            <span className="text-[11px] font-bold text-(--on-surface-variant) opacity-60">
                              {new Date(item.fecha).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-(--on-surface) mb-1">
                            {item.titulo}
                          </h4>
                          <p className="text-xs text-(--on-surface-variant) leading-relaxed">
                            {item.observacion || "Sin detalles registrados."}
                          </p>
                          <div className="mt-3 pt-3 border-t border-(--outline-variant)/10 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-(--on-surface-variant) uppercase">
                              Agente:{" "}
                              <span className="text-(--primary)">
                                {item.agente}
                              </span>
                            </span>
                          </div>
                        </div>
                      </m.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </m.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-(--outline-variant)/20 rounded-3xl py-20 text-center">
              <User size={48} className="text-neutral-200 mb-4" />
              <p className="text-neutral-400 font-medium">
                Selecciona un cliente para ver su historial de seguimiento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
