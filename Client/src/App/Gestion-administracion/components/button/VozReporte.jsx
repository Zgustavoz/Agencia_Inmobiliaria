import React from "react";
import { useVozIA } from "../hooks/useVozIA"; // Ajusta la ruta si es necesario

const VozReporte = () => {
  const { isRecording, isLoading, startRecording, stopRecording } = useVozIA();

  const handleClick = async () => {
    if (isRecording) {
      // Detenemos y esperamos la respuesta del backend
      const data = await stopRecording();

      if (data?.url_descarga) {
        console.log("Descargando desde:", data.url_descarga);
        const extensiones = {
          excel: "xlsx",
          pdf: "pdf",
          html: "html",
        };
        const formatoIA = data.ia_detecto.formato;
        // Si por alguna razón la IA da un formato raro, usamos el que dio por defecto
        const extensionReal = extensiones[formatoIA] || formatoIA;
        // FORZAR DESCARGA (Método más seguro que window.open)
        const link = document.createElement("a");
        link.href = data.url_descarga;

        // Esto obliga al navegador a descargar en lugar de abrir
        link.setAttribute(
          "download",
          `reporte_${data.ia_detecto.entidad}.${extensionReal}`,
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`¡Listo! Reporte de ${data.ia_detecto.entidad} generado.`);
      } else {
        alert("La IA entendió, pero no se pudo generar el archivo.");
      }
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`btn-voz ${isRecording ? "grabando" : ""}`}
      style={{
        backgroundColor: isRecording ? "#d32f2f" : "#1976d2",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {isLoading
        ? "⌛ Procesando..."
        : isRecording
          ? "🛑 Detener"
          : "🎤 Reporte por Voz"}
    </button>
  );
};

export default VozReporte;
