import { useState, useEffect } from "react";
import { 
  Clock, Plus, Trash2, Calendar, 
  ChevronRight, Building2, AlertCircle
} from "lucide-react";
import { getPropiedades } from "../../../Gestion-administracion-propiedades/gestion-propiedad/api/propiedadApi";
import { getHorariosDisponibilidad, createHorarioDisponibilidad, deleteHorarioDisponibilidad } from "../api/visitaApi";
import { m, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

const DIAS = [
  { id: 0, label: "Lunes" },
  { id: 1, label: "Martes" },
  { id: 2, label: "Miércoles" },
  { id: 3, label: "Jueves" },
  { id: 4, label: "Viernes" },
  { id: 5, label: "Sábado" },
  { id: 6, label: "Domingo" },
];

export const HorariosConfigPage = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newHorario, setNewHorario] = useState({
    dia_semana: 0,
    hora_inicio: "09:00",
    hora_fin: "12:00"
  });

  useEffect(() => {
    fetchPropiedades();
  }, []);

  useEffect(() => {
    if (selectedProp) {
      fetchHorarios(selectedProp.id_propiedad);
    }
  }, [selectedProp]);

  const fetchPropiedades = async () => {
    try {
      const data = await getPropiedades();
      setPropiedades(data.results || data);
      if ((data.results || data).length > 0) {
        setSelectedProp((data.results || data)[0]);
      }
    } catch (error) {
      toast.error("Error al cargar propiedades");
    } finally {
      setLoading(false);
    }
  };

  const fetchHorarios = async (propId) => {
    try {
      const data = await getHorariosDisponibilidad({ propiedad_id: propId });
      setHorarios(data.results || data);
    } catch (error) {
      toast.error("Error al cargar horarios");
    }
  };

  const handleAddHorario = async () => {
    try {
      await createHorarioDisponibilidad({
        ...newHorario,
        propiedad: selectedProp.id_propiedad,
        activo: true
      });
      toast.success("Horario agregado");
      fetchHorarios(selectedProp.id_propiedad);
    } catch (error) {
      toast.error("Error al agregar horario");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHorarioDisponibilidad(id);
      toast.success("Horario eliminado");
      fetchHorarios(selectedProp.id_propiedad);
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--on-surface) tracking-tight text-center lg:text-left">Configuración de Horarios</h1>
        <p className="text-sm text-(--on-surface-variant) text-center lg:text-left">Define las ventanas de tiempo disponibles para visitas por propiedad</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lista de Propiedades */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-(--primary) px-2">Seleccionar Propiedad</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {propiedades.map((prop) => (
              <button
                key={prop.id_propiedad}
                onClick={() => setSelectedProp(prop)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                  selectedProp?.id_propiedad === prop.id_propiedad
                    ? "bg-(--primary) border-(--primary) shadow-md"
                    : "bg-(--surface-container-lowest) border-(--outline-variant)/20 hover:border-(--primary)/40"
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black/5">
                   {prop.imagenes?.[0] ? (
                     <img src={prop.imagenes[0].url_imagen} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-neutral-300">
                       <Building2 size={20} />
                     </div>
                   )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${selectedProp?.id_propiedad === prop.id_propiedad ? "text-white" : "text-(--on-surface)"}`}>
                    {prop.titulo}
                  </p>
                  <p className={`text-[10px] uppercase font-bold opacity-60 ${selectedProp?.id_propiedad === prop.id_propiedad ? "text-white" : "text-(--on-surface-variant)"}`}>
                    {prop.codigo_propiedad}
                  </p>
                </div>
                <ChevronRight size={16} className={`ml-auto shrink-0 ${selectedProp?.id_propiedad === prop.id_propiedad ? "text-white" : "text-neutral-300"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Configuración de Horarios */}
        <div className="lg:col-span-8">
          {selectedProp ? (
            <m.div 
              key={selectedProp.id_propiedad}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-(--surface-container-lowest) rounded-3xl border border-(--outline-variant)/20 shadow-sm overflow-hidden"
            >
              {/* Prop Detail Header */}
              <div className="p-6 bg-gradient-to-r from-(--primary) to-(--primary-container) text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Clock className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedProp.titulo}</h2>
                    <p className="text-xs font-medium opacity-80">Gestión de disponibilidad semanal</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Add Form */}
                <div className="bg-(--surface-container-low) p-6 rounded-2xl border border-(--outline-variant)/10">
                  <h4 className="text-xs font-bold text-(--on-surface) uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Plus size={14} className="text-(--primary)" /> Agregar Nueva Ventana
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-(--on-surface-variant) uppercase ml-1 mb-1 block">Día de la Semana</label>
                      <select 
                        className="w-full p-3 bg-(--surface-container) rounded-xl text-sm outline-none border-none focus:ring-2 focus:ring-(--primary)/20"
                        value={newHorario.dia_semana}
                        onChange={(e) => setNewHorario({...newHorario, dia_semana: parseInt(e.target.value)})}
                      >
                        {DIAS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-(--on-surface-variant) uppercase ml-1 mb-1 block">Inicio</label>
                      <input 
                        type="time" 
                        className="w-full p-3 bg-(--surface-container) rounded-xl text-sm outline-none border-none"
                        value={newHorario.hora_inicio}
                        onChange={(e) => setNewHorario({...newHorario, hora_inicio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-(--on-surface-variant) uppercase ml-1 mb-1 block">Fin</label>
                      <input 
                        type="time" 
                        className="w-full p-3 bg-(--surface-container) rounded-xl text-sm outline-none border-none"
                        value={newHorario.hora_fin}
                        onChange={(e) => setNewHorario({...newHorario, hora_fin: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddHorario}
                    className="w-full mt-6 py-3 bg-(--primary) text-(--on-primary) rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-(--primary)/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Guardar Horario
                  </button>
                </div>

                {/* List Table */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-(--on-surface-variant) uppercase tracking-wider px-1">Horarios Configuradas</h4>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {horarios.length > 0 ? (
                        horarios.map((h) => (
                          <m.div
                            key={h.id_horario}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center justify-between p-4 bg-white border border-(--outline-variant)/10 rounded-2xl hover:border-(--primary)/20 transition-all group"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-24">
                                <span className="text-sm font-bold text-(--on-surface)">
                                  {DIAS.find(d => d.id === h.dia_semana)?.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                <Clock size={14} />
                                <span className="text-xs font-bold">{h.hora_inicio.substring(0,5)} - {h.hora_fin.substring(0,5)}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDelete(h.id_horario)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </m.div>
                        ))
                      ) : (
                        <div className="py-12 text-center bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                           <AlertCircle className="mx-auto mb-2 text-neutral-300" />
                           <p className="text-sm text-neutral-400 italic">No hay horarios configurados para esta propiedad</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </m.div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-(--outline-variant)/20 rounded-3xl py-20">
               <div className="text-center space-y-3">
                  <Building2 size={48} className="mx-auto text-neutral-200" />
                  <p className="text-neutral-400 font-medium">Selecciona una propiedad para configurar sus horarios</p>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
