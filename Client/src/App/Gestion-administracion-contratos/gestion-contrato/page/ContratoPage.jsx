import { useState } from "react";
import {
  FileText,
  Plus,
  CheckCircle,
  AlertTriangle,
  Archive,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router";

import { useContratos } from "../hooks/useContratos";
import { ContratoTable } from "../components/ContratoTable";
import { ContratoForm } from "../components/ContratoForm";
import { PagoContratoPage } from "./PagoContratoPage";

import {
  exportarContratoPDF,
  obtenerDocumentosContrato
} from "../api/contratoApi";

import { DocumentosContratoModal } from "../components/DocumentosContratoModal";

export const ContratoPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [showDocs, setShowDocs] = useState(false);

  const navigate = useNavigate();
  const { contratos, stats, refetch } = useContratos();

  const handleNuevo = () => {
    setContratoSeleccionado(null);
    setViewMode("form");
  };

  const handleEditar = (contrato) => {
    setContratoSeleccionado(contrato);
    setViewMode("form");
  };

  const handleVerDetalle = (contrato) => {
    navigate(`/dashboard/contratos/${contrato.id_contrato}`);
  };

  const handleExportar = async (contrato) => {
    await exportarContratoPDF(contrato.id_contrato);
  };

  const handleVerDocumentos = async (contrato) => {
    const docs = await obtenerDocumentosContrato(
      contrato.id_contrato
    );

    setDocumentos(docs);
    setShowDocs(true);
  };

  const handlePagos = (contrato) => {
    setContratoSeleccionado(contrato);
    setViewMode("pagos");
  };

  return (
    <div className="p-8 bg-[#F8F9FB] min-h-screen font-sans text-neutral-600">

      {viewMode === "list" && (
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 tracking-tight flex items-center gap-3">
                <FileText size={30} />
                Gestión de Contratos
              </h1>

              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Administración Legal
                </span>
              </div>
            </div>

            <button
              onClick={handleNuevo}
              className="bg-[#0052CC] hover:bg-[#0041a3] text-white px-7 py-3 rounded-lg font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={18} />
              Nuevo Contrato
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            <StatCard
              icon={<CheckCircle size={24} />}
              title="Activos"
              value={stats.activos}
              color="emerald"
            />

            <StatCard
              icon={<AlertTriangle size={24} />}
              title="Vencidos"
              value={stats.vencidos}
              color="amber"
            />

            <StatCard
              icon={<Archive size={24} />}
              title="Finalizados"
              value={stats.finalizados}
              color="neutral"
            />

            <StatCard
              icon={<Edit size={24} />}
              title="Borradores"
              value={stats.borradores}
              color="blue"
            />
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-50">
              <h2 className="text-sm font-bold text-neutral-800">
                Contratos Registrados
              </h2>
            </div>

            <div className="p-2">
              <ContratoTable
                contratos={contratos}
                onEditar={handleEditar}
                onVerDetalle={handleVerDetalle}
                onExportar={handleExportar}
                onVerDocumentos={handleVerDocumentos}
                onPagos={handlePagos}
              />
            </div>
          </div>

        </div>
      )}

      {viewMode === "form" && (
        <ContratoForm
          contratoAEditar={contratoSeleccionado}
          onCancel={() => setViewMode("list")}
          onSuccess={() => {
            setViewMode("list");
            refetch();
          }}
        />
      )}

      {viewMode === "pagos" && (
        <PagoContratoPage
          contrato={contratoSeleccionado}
          onVolver={() => setViewMode("list")}
        />
      )}

      {showDocs && (
        <DocumentosContratoModal
          documentos={documentos}
          onClose={() => setShowDocs(false)}
        />
      )}

    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    neutral: "bg-neutral-100 text-neutral-700",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          {title}
        </p>

        <p className="text-2xl font-black text-neutral-800">
          {value}
        </p>
      </div>
    </div>
  );
};
