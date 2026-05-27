import { useState, useEffect } from "react";
import { getTenants, updateTenantStatus } from "../api/superAdminApi";
import { 
  Building2, 
  Users, 
  Home, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence } from "motion/react";
import { TenantDetailModal } from "../components/modal/TenantDetailModal";

export const TenantListPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);
  const fetchTenants = async () => {
    try {
      const data = await getTenants();
      setTenants(data);
    } catch (error) {
      toast.error("Error al cargar los tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateTenantStatus(id, !currentStatus);
      toast.success("Estado actualizado");
      fetchTenants();
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Cargando empresas...</div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Empresas Registradas</h1>
          <p className="text-slate-500 text-sm">Gestiona todas las inmobiliarias activas en la plataforma.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar inmobiliaria..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header del Card */}
            <div className="p-5 border-b border-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tenant.estado ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 truncate w-40">{tenant.nombre}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      tenant.plan === 'empresa' ? 'bg-purple-100 text-purple-700' :
                      tenant.plan === 'profesional' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Plan {tenant.plan_display}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleStatus(tenant.id, tenant.estado)}
                  title={tenant.estado ? "Desactivar" : "Activar"}
                >
                  {tenant.estado ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats Rápidos */}
            <div className="px-5 py-4 bg-slate-50/50 grid grid-cols-3 gap-2 border-b border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Propiedades</p>
                <div className="flex items-center justify-center gap-1 text-slate-700 font-bold">
                  <Home className="w-3 h-3" />
                  <span>{tenant.total_propiedades}</span>
                </div>
              </div>
              <div className="text-center border-x border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Clientes</p>
                <div className="flex items-center justify-center gap-1 text-slate-700 font-bold">
                  <Users className="w-3 h-3" />
                  <span>{tenant.total_clientes}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Usuarios</p>
                <div className="flex items-center justify-center gap-1 text-slate-700 font-bold">
                  <Users className="w-3 h-3" />
                  <span>{tenant.total_usuarios}</span>
                </div>
              </div>
            </div>

            {/* Footer del Card */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className={`text-xs ${tenant.vencido ? 'text-rose-600 font-bold' : ''}`}>
                  Vence: {tenant.fecha_vencimiento_pago}
                </span>
              </div>
              
              <button 
                onClick={() => setSelectedTenantId(tenant.id)}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                Ver detalle
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTenantId && (
          <TenantDetailModal 
            tenantId={selectedTenantId} 
            onClose={() => setSelectedTenantId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
