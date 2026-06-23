import {
  FileText,
  Pencil,
  Download,
  FolderOpen,
  CreditCard,
  Clock,
} from "lucide-react";

// Función para calcular el tiempo restante
const calcularTiempoRestante = (fechaFin, estado) => {
  if (!fechaFin || estado === "FINALIZADO" || estado === "ANULADO") return null;

  const hoy = new Date();
  const fin = new Date(fechaFin);
  const diffTime = fin - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { texto: "Vencido", color: "bg-red-100 text-red-700" };
  if (diffDays === 0)
    return { texto: "Vence hoy", color: "bg-amber-100 text-amber-700" };
  if (diffDays <= 15)
    return {
      texto: `Quedan ${diffDays} días`,
      color: "bg-amber-100 text-amber-700",
    }; // Alerta de 15 días o menos

  const mesesRestantes = Math.floor(diffDays / 30);
  if (mesesRestantes > 0) {
    return {
      texto: `Quedan ~${mesesRestantes} meses`,
      color: "bg-emerald-100 text-emerald-700",
    };
  }

  return {
    texto: `Quedan ${diffDays} días`,
    color: "bg-emerald-100 text-emerald-700",
  };
};

export const ContratoTable = ({
  contratos,
  onEditar,
  onExportar,
  onVerDocumentos,
  onPagos,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-neutral-100">
          <tr className="text-left text-sm text-neutral-500">
            <th className="p-4">Código</th>
            <th className="p-4">Propiedad</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Agente</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Monto</th>
            <th className="p-4">Inicio</th>
            <th className="p-4">Fin / Seguimiento</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {contratos.map((c) => {
            const tiempoRestante = calcularTiempoRestante(
              c.fecha_fin,
              c.estado_real,
            );

            return (
              <tr
                key={c.id_contrato}
                className="border-b border-neutral-50 hover:bg-neutral-50 transition"
              >
                <td className="p-4 font-medium text-neutral-800">
                  {c.codigo_contrato}
                </td>
                <td className="p-4">{c.propiedad_nombre}</td>
                <td className="p-4">{c.cliente_nombre_completo}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {c.estado_real}
                  </span>
                </td>
                <td className="p-4 font-medium">Bs. {c.monto}</td>
                <td className="p-4 text-neutral-500">{c.fecha_inicio}</td>

                {/* Columna Modificada para el Seguimiento */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-neutral-800">
                      {c.fecha_fin || "Indefinido"}
                    </span>
                    {tiempoRestante && (
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold w-max ${tiempoRestante.color}`}
                      >
                        <Clock size={12} />
                        {tiempoRestante.texto}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPagos(c)}
                      className="p-2 rounded-lg hover:bg-violet-50 text-violet-600 transition"
                      title="Pagos"
                    >
                      <CreditCard size={18} />
                    </button>
                    <button
                      onClick={() => onEditar(c)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onExportar(c)}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition"
                      title="Exportar PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {contratos.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <FileText className="mx-auto mb-4" size={42} />
          No hay contratos registrados
        </div>
      )}
    </div>
  );
};
