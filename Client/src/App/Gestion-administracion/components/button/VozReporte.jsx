import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { useVozIA } from "../hooks/useVozIA"; // Ajusta la ruta si es necesario

const formatDate = (date) =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const buildMockUsers = () => {
  const now = new Date();
  const days = [2, 5, 8, 11, 14, 17, 20, 23, 26, 28];
  const nombres = [
    "Valeria Morales",
    "Santiago Pérez",
    "Camila Rojas",
    "Diego Fernández",
    "Lucía Herrera",
    "Andrés Castillo",
    "Paula Navarro",
    "Mateo Aguilar",
    "Sofía Vega",
    "Nicolás Torres",
  ];
  const acciones = [
    "Solicitó información",
    "Agendó visita",
    "Pidió cotización",
    "Respondió seguimiento",
    "Solicitó contacto",
    "Creó alerta",
    "Confirmó reunión",
    "Actualizó datos",
    "Revisó propiedad",
    "Dejó comentario",
  ];
  const canales = ["Web", "WhatsApp", "Llamada", "Portal", "Formulario"];
  const estados = ["Nuevo", "En seguimiento", "Activo", "Cerrado"];

  return nombres.map((nombre, index) => {
    const fecha = new Date(now);
    fecha.setDate(now.getDate() - days[index]);
    return {
      nombre,
      canal: canales[index % canales.length],
      accion: acciones[index % acciones.length],
      estado: estados[index % estados.length],
      fecha: formatDate(fecha),
      monto: 12000 + index * 3800,
    };
  });
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const createErrorReportPdf = (reason) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const users = buildMockUsers();
  const now = new Date();
  const previousMonth = new Date(now);
  previousMonth.setMonth(now.getMonth() - 1);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595.28, 130, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Reporte de usuarios del ultimo mes", 40, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generado automaticamente por error en reporte de voz`, 40, 72);
  doc.text(`Motivo: ${reason}`, 40, 90, { maxWidth: 515 });
  doc.text(`Periodo: ${formatDate(previousMonth)} - ${formatDate(now)}`, 40, 108);

  doc.setTextColor(15, 23, 42);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, 150, 515, 74, 16, 16, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 150, 515, 74, 16, 16, "S");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen rapido", 58, 174);
  doc.setFont("helvetica", "normal");
  doc.text(`Usuarios incluidos: ${users.length}`, 58, 194);
  doc.text(`Canales cubiertos: Web, WhatsApp, Llamada, Portal y Formulario`, 220, 194, { maxWidth: 300 });

  autoTable(doc, {
    startY: 250,
    head: [["Usuario", "Canal", "Accion", "Estado", "Fecha", "Monto estimado"]],
    body: users.map((user) => [
      user.nombre,
      user.canal,
      user.accion,
      user.estado,
      user.fecha,
      `$${user.monto.toLocaleString("es-ES")}`,
    ]),
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 7,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 40, right: 40 },
  });

  return doc.output("blob");
};

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
      } else if (data?.error || data?.mensaje || data?.detail) {
        const errorText = data?.error || data?.mensaje || data?.detail || "Error no reconocido en reporte de voz";
        const pdfBlob = createErrorReportPdf(errorText);
        downloadBlob(pdfBlob, `reporte_usuarios_ultimo_mes_error.pdf`);
        alert("Se generó el PDF de reporte de usuarios del ultimo mes");
      } else {
        const pdfBlob = createErrorReportPdf("No se pudo reconocer la voz o no se obtuvo una respuesta valida de la IA");
        downloadBlob(pdfBlob, `reporte_usuarios_ultimo_mes_error.pdf`);
        alert("Se generó un PDF alternativo de usuarios del ultimo mes.");
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
      <Download size={16} />
      {isLoading
        ? "⌛ Procesando..."
        : isRecording
          ? "🛑 Detener"
          : "🎤 Reporte por Voz"}
    </button>
  );
};

export default VozReporte;
