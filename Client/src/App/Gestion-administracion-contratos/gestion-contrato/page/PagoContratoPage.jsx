import { useEffect, useState } from "react";
import { obtenerPagosContrato } from "../api/contratoApi"; // lo crearemos después

export const PagoContratoPage = ({ contrato, onVolver }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contrato?.id_contrato) return;

    const fetchPagos = async () => {
      try {
        setLoading(true);

        const data = await obtenerPagosContrato(
          contrato.id_contrato
        );

        setPagos(data);
      } catch (error) {
        console.error("Error cargando pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [contrato]);

  return (
    <div className="p-8 bg-white rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">
          Pagos del contrato {contrato?.codigo_contrato}
        </h1>

        <button
          onClick={onVolver}
          className="px-4 py-2 border rounded"
        >
          Volver
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Cargando pagos...</p>
      ) : pagos.length === 0 ? (
        <p className="text-gray-500">
          No hay pagos registrados para este contrato
        </p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2">Monto</th>
              <th className="p-2">Vencimiento</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha pago</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((p) => (
              <tr key={p.id_pago}>
                <td className="p-2">Bs. {p.monto}</td>
                <td className="p-2">{p.fecha_vencimiento}</td>
                <td className="p-2">{p.estado}</td>
                <td className="p-2">
                  {p.fecha_pago || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};