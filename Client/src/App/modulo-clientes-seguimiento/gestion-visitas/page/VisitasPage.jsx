import { useState, useEffect } from "react";
import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  User, Building2, Star, MessageSquare,
  Search, Filter, Plus, ChevronRight
} from "lucide-react";
import { getVisitas, updateVisita } from "../api/visitaApi";
import { m, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

export const VisitasPage = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const fetchVisitas = async () => {
    try {
      setLoading(true);
      const data = await getVisitas();
      setVisitas(data.results || data);
    } catch (error) {
      toast.error("Error al cargar visitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await updateVisita(id, { estado: nuevoEstado });
      toast.success(`Visita ${nuevoEstado}`);
      fetchVisitas();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada': return 'bg-green-100 text-green-700 border-green-200';
      case 'pendiente':  return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelada':  return 'bg-red-100 text-red-700 border-red-200';
      case 'realizada':  return 'bg-blue-100 text-blue-700 border-blue-200';
      default:           return 'bg-neutral-100 text-neutral-700';
    }
  };

  const filteredVisitas = visitas.filter(v => 
    (v.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     v.propiedad_titulo?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterEstado === "" || v.estado === filterEstado)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--on-surface) tracking-tight">Gestión de Visitas</h1>
          <p className="text-sm text-(--on-surface-variant)">Administra las citas y el seguimiento de clientes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 bg-(--surface-container-low) p-4 rounded-2xl border border-(--outline-variant)/20 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--on-surface-variant) opacity-50" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o propiedad..."
            className="w-full pl-10 pr-4 py-2.5 bg-(--surface-container) rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--primary)/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2.5 bg-(--surface-container) rounded-xl text-sm outline-none focus:ring-2 focus:ring-(--primary)/20"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Grid de Visitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVisitas.map((visita, idx) => (
            <m.div
              key={visita.id_visita}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-(--surface-container-lowest) border border-(--outline-variant)/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-(--outline-variant)/10 bg-gradient-to-br from-white to-(--surface-container-low)/30">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getEstadoColor(visita.estado)}`}>
                    {visita.estado}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-bold text-(--on-surface-variant) opacity-60">ID #{visita.id_visita}</p>
                  </div>
                </div>
                <h3 className="font-bold text-(--on-surface) line-clamp-1 flex items-center gap-2">
                  <Building2 size={16} className="text-(--primary)" />
                  {visita.propiedad_titulo}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-(--primary-container) flex items-center justify-center text-(--on-primary-container)">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-(--on-surface-variant) uppercase tracking-tighter">Cliente</p>
                    <p className="text-sm font-semibold text-(--on-surface)">{visita.cliente_nombre}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-(--on-surface-variant)">
                    <Calendar size={14} className="text-(--primary)" />
                    <span className="text-xs font-medium">{visita.fecha_visita}</span>
                  </div>
                  <div className="flex items-center gap-2 text-(--on-surface-variant)">
                    <Clock size={14} className="text-(--primary)" />
                    <span className="text-xs font-medium">{visita.hora_inicio.substring(0,5)} - {visita.hora_fin.substring(0,5)}</span>
                  </div>
                </div>

                {visita.calificacion && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-700">{visita.calificacion} / 5</span>
                    <span className="text-[10px] text-yellow-600 opacity-80">Calificación del cliente</span>
                  </div>
                )}

                {(visita.comentario_cliente || visita.comentario_agente) && (
                   <div className="bg-(--surface-container-low) p-3 rounded-xl space-y-2">
                     {visita.comentario_cliente && (
                       <div className="flex gap-2">
                         <MessageSquare size={12} className="shrink-0 mt-1 opacity-40" />
                         <p className="text-[11px] italic line-clamp-2">"{visita.comentario_cliente}"</p>
                       </div>
                     )}
                   </div>
                )}
              </div>

              {/* Card Footer / Actions */}
              <div className="p-4 bg-(--surface-container-low)/50 flex gap-2">
                {visita.estado === 'pendiente' && (
                  <>
                    <button 
                      onClick={() => handleUpdateEstado(visita.id_visita, 'confirmada')}
                      className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} /> Confirmar
                    </button>
                    <button 
                      onClick={() => handleUpdateEstado(visita.id_visita, 'cancelada')}
                      className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={14} /> Cancelar
                    </button>
                  </>
                )}
                {visita.estado === 'confirmada' && (
                  <button 
                    onClick={() => handleUpdateEstado(visita.id_visita, 'realizada')}
                    className="flex-1 py-2 bg-(--primary) text-(--on-primary) rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Marcar como Realizada
                  </button>
                )}
              </div>
            </m.div>
          ))}
        </AnimatePresence>

        {!loading && filteredVisitas.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-(--surface-container) rounded-full flex items-center justify-center mx-auto opacity-20">
              <Calendar size={32} />
            </div>
            <p className="text-(--on-surface-variant) font-medium italic">No se encontraron visitas que coincidan</p>
          </div>
        )}
      </div>
    </div>
  );
};
