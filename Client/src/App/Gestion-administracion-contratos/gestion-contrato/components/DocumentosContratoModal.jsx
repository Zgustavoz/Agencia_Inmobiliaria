import { X, FileText, Download } from "lucide-react";

export const DocumentosContratoModal = ({
  documentos,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-neutral-800">
            Documentos del Contrato
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {documentos.length > 0 ? (
            documentos.map((doc) => (
              <div
                key={doc.id_documento}
                className="flex justify-between items-center border rounded-xl p-4 hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={22} />

                  <div>
                    <p className="font-semibold text-neutral-800">
                      {doc.nombre}
                    </p>

                    <p className="text-sm text-neutral-500">
                      Documento generado
                    </p>
                  </div>
                </div>

                <a
                  href={doc.archivo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} />
                  Descargar
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-neutral-500">
              No hay documentos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};