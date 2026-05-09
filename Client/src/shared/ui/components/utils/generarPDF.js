import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const generarPDF = (config) => {
  const {
    empresa = "MI EMPRESA",
    titulo = "REPORTE",
    metadata = {},
    secciones = [],
    nombreArchivo = "reporte.pdf",
  } = config

  const doc = new jsPDF()
  let yPos = 20

  // ── Título principal ───────────────────────────
  doc.setFontSize(18)
  doc.text(empresa, 14, yPos)
  yPos += 8

  doc.setFontSize(14)
  doc.text(titulo, 14, yPos)
  yPos += 12

  // ── Metadata ───────────────────────────────────
  if (Object.keys(metadata).length > 0) {
    doc.setFontSize(10)

    Object.entries(metadata).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, yPos)
      yPos += 5
    })

    yPos += 5
  }

  // ── Secciones ──────────────────────────────────
  secciones.forEach((seccion) => {

    // Nueva página si falta espacio
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    const {
      titulo: tituloSeccion = "Sección",
      columnas = [],
      datos = [],
      mapearDatos = null,
    } = seccion

    // ── Título sección ──────────────────────────
    doc.setFontSize(12)
    doc.text(tituloSeccion, 14, yPos)
    yPos += 8

    // ── Procesar datos ──────────────────────────
    const datosProcesados = mapearDatos
      ? datos.map(mapearDatos)
      : datos.map(item =>
          columnas.map(col => {
            const clave = col.toLowerCase().replace(/ /g, "_")
            const valor = item[clave] ?? item[col] ?? "-"

            if (typeof valor === "boolean") {
              return valor ? "Activo" : "Inactivo"
            }

            return valor
          })
        )

    // ── Tabla ───────────────────────────────────
    if (datosProcesados.length > 0) {

      autoTable(doc, {
        startY: yPos,

        head: [columnas],

        body: datosProcesados,

        theme: "striped",

        styles: {
          fontSize: 9,
          cellPadding: 3,
        },

        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },

        margin: {
          left: 14,
          right: 14,
        },
      })

      yPos = doc.lastAutoTable.finalY + 10

    } else {

      doc.setFontSize(10)
      doc.text("No hay datos disponibles", 14, yPos)
      yPos += 10
    }
  })

  // ── Guardar ────────────────────────────────────
  doc.save(nombreArchivo)
}

export default generarPDF