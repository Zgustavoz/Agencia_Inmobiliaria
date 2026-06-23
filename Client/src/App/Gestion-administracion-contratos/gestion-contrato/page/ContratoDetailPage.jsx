import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, User, Home, Percent, CalendarDays, ClipboardList } from "lucide-react";
import { obtenerContrato, exportarContratoPDF } from "../api/contratoApi";

export const ContratoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        setLoading(true);
        const data = await obtenerContrato(id);
        setContrato(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el contrato.");
      } finally {
        setLoading(false);
      }
    };

    fetchContrato();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 bg-[#F8F9FB] min-h-screen">
        <p className="text-lg text-neutral-600">Cargando detalles del contrato...</p>
      </div>
    );
  }

  if (error || !contrato) {
    return (
      <div className="p-8 bg-[#F8F9FB] min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-neutral-700 mb-6"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <p className="text-red-600">{error || "Contrato no encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8F9FB] min-h-screen font-sans text-neutral-600">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-neutral-700 mb-4"
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">
              Detalle del Contrato
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              Código {contrato.codigo_contrato} • {contrato.estado_real || contrato.estado_contrato}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportarContratoPDF(contrato.id_contrato)}
              className="inline-flex items-center gap-2 bg-[#0052CC] text-white px-5 py-3 rounded-lg shadow-sm"
            >
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold">Información del contrato</h2>
            </div>
            <dl className="grid grid-cols-1 gap-4 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold">Código</dt>
                <dd>{contrato.codigo_contrato}</dd>
              </div>
              <div>
                <dt className="font-semibold">Tipo de operación</dt>
                <dd>{contrato.tipo_operacion}</dd>
              </div>
              <div>
                <dt className="font-semibold">Estado</dt>
                <dd>{contrato.estado_real}</dd>
              </div>
              <div>
                <dt className="font-semibold">Inicio</dt>
                <dd>{contrato.fecha_inicio}</dd>
              </div>
              <div>
                <dt className="font-semibold">Fin</dt>
                <dd>{contrato.fecha_fin || "-"}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Home size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold">Propiedad vinculada</h2>
            </div>
            <dl className="grid grid-cols-1 gap-4 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold">Propiedad</dt>
                <dd>{contrato.propiedad_nombre || contrato.propiedad?.nombre || "No disponible"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Monto</dt>
                <dd>Bs. {contrato.monto || "0.00"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Garantía</dt>
                <dd>{contrato.garantia ? `Bs. ${contrato.garantia}` : "No aplica"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Comisión</dt>
                <dd>Bs. {contrato.comision || "0.00"}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold">Parte cliente</h2>
            </div>
            <p className="text-sm text-neutral-700">
              {contrato.cliente_nombre_completo || contrato.cliente?.nombre || "No disponible"}
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold">Parte agente</h2>
            </div>
            <p className="text-sm text-neutral-700">
              {contrato.agente_nombre_completo || contrato.agente?.nombre || "No disponible"}
            </p>
          </section>
        </div>

        <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList size={20} className="text-slate-600" />
            <h2 className="text-lg font-semibold">Condiciones y observaciones</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700">
            <div>
              <dt className="font-semibold">Condiciones</dt>
              <p>{contrato.condiciones || "No especificadas."}</p>
            </div>
            <div>
              <dt className="font-semibold">Observaciones</dt>
              <p>{contrato.observaciones || "No hay observaciones."}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};