import { RotateCcw, Database, RefreshCcw } from "lucide-react";

export const BackupTable = ({
  backups,
  onRestaurar,
  isRestoring,
  canRestore = true,
}) => {
  return (
    <div className="bg-(--surface-container-lowest) rounded-xl border border-(--outline-variant)/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--outline-variant)/20">
          <thead className="bg-(--surface-container-low)">
            <tr>
              {["Archivo", "Fecha", "Tamaño", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--outline-variant)/10">
            {!backups?.length ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-(--on-surface-variant) text-sm"
                >
                  No hay respaldos disponibles
                </td>
              </tr>
            ) : (
              backups.map((b) => (
                <tr
                  key={b.nombre}
                  className="hover:bg-(--surface-container-low) transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-(--primary)" />
                      <span className="font-mono text-xs text-(--on-surface)">
                        {b.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-(--on-surface-variant)">
                    {b.fecha}
                  </td>
                  <td className="px-6 py-4 text-sm text-(--on-surface-variant)">
                    {/* Asegúrate de que b.tamaño coincida con lo que manda tu API */}
                    {b.tamaño}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRestaurar(b.nombre)}
                      disabled={isRestoring || !canRestore}
                      className={`flex items-center gap-1 ml-auto px-3 py-1.5 text-xs font-medium rounded-lg transition
                        ${
                          isRestoring || !canRestore
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-orange-600 hover:bg-orange-50 active:bg-orange-100"
                        }`}
                    >
                      {/* Intercambiamos el icono por uno animado si está restaurando */}
                      {isRestoring ? (
                        <RefreshCcw size={14} className="animate-spin" />
                      ) : (
                        <RotateCcw size={14} />
                      )}

                      {isRestoring ? "Restaurando..." : "Restaurar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
