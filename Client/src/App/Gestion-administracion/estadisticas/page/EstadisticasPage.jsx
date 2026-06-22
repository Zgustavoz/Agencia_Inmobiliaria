import { useEstadisticas } from "../hooks/useEstadisticas";
import { StatCard } from "../components/StatCard";
import { GraficoBarras } from "../components/GraficoBarras";
import { GraficoPie } from "../components/GraficoPie";
import { GraficoLineas } from "../components/GraficoLineas";
import { Building2, Users, FileText } from "lucide-react";

export const EstadisticasPage = () => {
  const { data, loading, error } = useEstadisticas();

  if (loading) return <p className="p-4">Cargando estadísticas...</p>;
  if (error) return <p className="p-4">Error cargando estadísticas</p>;
  if (!data) return <p className="p-4">No hay datos</p>;

  return (
    <div className="p-6 space-y-8">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Propiedades"
          value={data.propiedades?.total || 0}
          icon={Building2}
        />

        <StatCard
          title="Usuarios"
          value={data.usuarios?.total || 0}
          icon={Users}
        />

        <StatCard
          title="Contratos Activos"
          value={data.contratos?.activos || 0}
          icon={FileText}
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <GraficoBarras
          data={data.ingresos?.mensual || []}
        />

        <GraficoPie
          data={data.propiedades_estado || []}
        />

      </div>

      {/* TENDENCIA */}
      <div className="grid grid-cols-1">
        <GraficoLineas
          data={data.ingresos?.mensual || []}
        />
      </div>

    </div>
  );
};