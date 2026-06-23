import {
  FileText,
  Pencil,
  Download,
  FolderOpen,
  CreditCard,
  Eye
} from "lucide-react";

export const ContratoTable = ({
  contratos,
  onEditar,
  onVerDetalle,
  onExportar,
  onVerDocumentos,
  onPagos
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
            <th className="p-4">Fin</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {contratos.map((c) => (
            <tr
              key={c.id_contrato}
              className="border-b border-neutral-50 hover:bg-neutral-50 transition"
            >
              <td className="p-4 font-medium text-neutral-800">
                {c.codigo_contrato}
              </td>

              <td className="p-4">
                {c.propiedad_nombre}
              </td>

              <td className="p-4">
                {c.cliente_nombre_completo}
              </td>

              <td className="p-4">
                {c.agente_nombre_completo}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  {c.estado_real}
                </span>
              </td>

              <td className="p-4">
                Bs. {c.monto}
              </td>

              <td className="p-4">
                {c.fecha_inicio}
              </td>

              <td className="p-4">
                {c.fecha_fin}
              </td>

              <td className="p-4">
                <div className="flex gap-2">

                  <button
                    onClick={() => onPagos(c)}
                    className="p-2 rounded-lg hover:bg-violet-50 text-violet-600"
                    title="Pagos"
                  >
                    <CreditCard size={16} />
                  </button>

                  <button
                    onClick={() => onVerDetalle(c)}
                    className="p-2 rounded-lg hover:bg-slate-50 text-slate-600"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => onEditar(c)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onExportar(c)}
                    className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600"
                    title="Exportar PDF"
                  >
                    <Download size={16} />
                  </button>

                  {/*
                  <button
                    onClick={() => onVerDocumentos(c)}
                    className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"
                    title="Ver documentos"
                  >
                    <FolderOpen size={16} />
                  </button>
                  */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {contratos.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <FileText
            className="mx-auto mb-4"
            size={42}
          />
          No hay contratos registrados
        </div>
      )}
    </div>
  );
};