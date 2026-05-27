import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { getGlobalStats } from "../api/superAdminApi";
import { 
  Building2, 
  Home, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

export const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getGlobalStats();
      setStats(data);
    } catch (error) {
      toast.error("Error al cargar estadísticas globales");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Tenants Activos",
      value: stats?.tenants_activos || 0,
      subValue: `${stats?.tenants_inactivos || 0} inactivos`,
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Total Propiedades",
      value: stats?.total_propiedades_sistema || 0,
      subValue: "En toda la plataforma",
      icon: Home,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Por Vencer (7 días)",
      value: stats?.suscripciones_por_vencer || 0,
      subValue: "Requieren atención",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Suscripciones Vencidas",
      value: stats?.suscripciones_vencidas || 0,
      subValue: "Acceso restringido",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de Control Global</h1>
          <p className="text-slate-500">Bienvenido, {user?.nombres}. Resumen operativo de la plataforma.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sistema Online</span>
        </div>
      </header>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{card.title}</p>
              <h3 className={`text-3xl font-black mt-1 ${card.color}`}>
                {loading ? "..." : card.value}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{card.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Crecimiento de la Plataforma
            </h2>
            <select className="text-xs font-bold text-slate-500 border-none bg-slate-50 rounded-lg px-3 py-1 outline-none">
              <option>Últimos 30 días</option>
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <TrendingUp className="w-12 h-12 text-slate-200 mb-2" />
            <p className="text-sm text-slate-400 font-medium">Gráficos de analítica en preparación...</p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Acciones de Control</h2>
          <div className="space-y-3">
            <button className="w-full p-4 text-left rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
               <p className="text-sm font-bold">Revisar Bitácora Global</p>
               <p className="text-xs opacity-60">Ver todas las acciones del sistema</p>
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group">
               <p className="text-sm font-bold">Generar Reporte de Ventas</p>
               <p className="text-xs opacity-60">Consolidado de todas las inmobiliarias</p>
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 transition-colors group">
               <p className="text-sm font-bold text-rose-600">Alertas de Seguridad</p>
               <p className="text-xs text-rose-400">0 amenazas detectadas hoy</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
