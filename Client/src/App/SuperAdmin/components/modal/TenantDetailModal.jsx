import { useState, useEffect } from "react";
import { getTenantDetail } from "../../api/superAdminApi";
import { 
  X, 
  Building2, 
  Users, 
  Home, 
  CreditCard, 
  Activity,
  Shield,
  Mail,
  Calendar,
  User
} from "lucide-react";
import { m, AnimatePresence } from "motion/react";

export const TenantDetailModal = ({ tenantId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (tenantId) fetchDetail();
  }, [tenantId]);

  const fetchDetail = async () => {
    try {
      const data = await getTenantDetail(tenantId);
      setDetail(data);
    } catch (error) {
      console.error("Error al cargar detalle", error);
    } finally {
      setLoading(false);
    }
  };

  if (!tenantId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <m.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header del Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{detail?.nombre || "Cargando..."}</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Detalle de Inmobiliaria</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-500 font-medium">Cargando información detallada...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex px-6 border-b border-slate-100 bg-white">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Vista General
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Usuarios ({detail.usuarios_lista?.length})
              </button>
              <button 
                onClick={() => setActiveTab("properties")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'properties' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Inmuebles Recientes
              </button>
            </div>

            {/* Contenido Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card Suscripción */}
                  <div className="col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-500" />
                        Estado de Suscripción
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Plan Actual</p>
                          <p className="text-sm font-bold text-slate-700 capitalize">{detail.plan_display}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Vencimiento</p>
                          <p className={`text-sm font-bold ${detail.vencido ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {detail.fecha_vencimiento_pago}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        Descripción
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        {detail.descripcion || "Sin descripción proporcionada."}
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-4">
                    <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-lg shadow-indigo-100">
                      <p className="text-xs font-bold opacity-80 uppercase mb-1 text-indigo-200">Capacidad</p>
                      <h4 className="text-2xl font-bold">{detail.total_propiedades} / {detail.max_propiedades}</h4>
                      <p className="text-[10px] mt-1 font-medium text-indigo-100">Propiedades registradas</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Clientes</span>
                        <Users className="w-4 h-4 text-slate-300" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">{detail.total_clientes}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-3">
                  {detail.usuarios_lista?.map(u => (
                    <div key={u.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{u.nombres} {u.apellidos}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="w-3 h-3" />
                            <span>{u.email}</span>
                            <span className="text-slate-300">|</span>
                            <span className="font-bold text-indigo-600">@{u.username}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${u.es_admin ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                        {u.rol_nombre}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'properties' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="px-4 py-3">Inmueble</th>
                        <th className="px-4 py-3">Precio</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Registrado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {detail.propiedades_recientes?.map(p => (
                        <tr key={p.id_propiedad} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-slate-700 truncate w-48">{p.titulo}</p>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-emerald-600">${p.precio}</td>
                          <td className="px-4 py-3">
                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                               {p.estado_propiedad}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-slate-400">
                            {new Date(p.creado_en).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {detail.propiedades_recientes?.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-10 text-center text-slate-400 text-sm font-medium italic">
                            Aún no han registrado propiedades.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </m.div>
    </div>
  );
};
