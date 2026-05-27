import { useAuth } from "../../auth/context/AuthContext";

export const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Panel de Control Global</h1>
        <p className="text-slate-600">Bienvenido, {user?.nombres}. Aquí tienes el resumen de toda la plataforma.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cards de Resumen - En el siguiente paso las conectaremos con el API */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Tenants Activos</p>
          <h3 className="text-3xl font-bold text-indigo-600">--</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Propiedades</p>
          <h3 className="text-3xl font-bold text-emerald-600">--</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Próximos Vencimientos</p>
          <h3 className="text-3xl font-bold text-amber-600">--</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Alertas Críticas</p>
          <h3 className="text-3xl font-bold text-rose-600">0</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Actividad Reciente del Sistema</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg text-slate-400">
          Gráficos y tablas de actividad en desarrollo...
        </div>
      </div>
    </div>
  );
};
