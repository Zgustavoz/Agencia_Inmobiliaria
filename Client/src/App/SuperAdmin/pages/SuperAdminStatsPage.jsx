import { useEffect, useMemo, useState } from "react";
import { FileText, Filter, Download, RefreshCw, Building2, Users, FileSignature, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { fetchReporte, downloadReporte, fetchReporteGlobal, downloadReporteGlobal } from "../api/reportesApi";
import { getTenants } from "../api/superAdminApi";

const REPORT_TYPES = [
  { key: "propiedades", label: "Propiedades", icon: Building2 },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "contratos", label: "Contratos", icon: FileSignature },
  { key: "operaciones", label: "Operaciones", icon: Layers },
];

const ESTADOS_CONTRATO = ["BORRADOR", "ACTIVO", "VENCIDO", "RENOVADO", "FINALIZADO", "ANULADO"];
const ESTADOS_CLIENTE = ["nuevo", "seguimiento", "activo", "inactivo", "cerrado"];
const ESTADOS_OPERACION = ["abierta", "cerrada", "anulada"];
const TIPOS_OPERACION = ["COMPRA", "VENTA", "ALQUILER", "ANTICRETICO"];
const ORIGEN_CLIENTE = ["web", "movil", "referido", "agente", "campana"];

export const SuperAdminStatsPage = () => {
  const [tipo, setTipo] = useState("propiedades");
  const [estado, setEstado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [zona, setZona] = useState("");
  const [origen, setOrigen] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  useEffect(() => {
    const loadTenants = async () => {
      setLoadingTenants(true);
      try {
        const list = await getTenants();
        const tenantsData = Array.isArray(list) ? list : list?.results || [];
        setTenants(tenantsData);
        setTenantId("all");
      } catch (error) {
        toast.error("Error al cargar tenants");
      } finally {
        setLoadingTenants(false);
      }
    };

    loadTenants();
  }, []);

  const columnas = useMemo(() => {
    switch (tipo) {
      case "clientes":
        return [
          { key: "codigo_cliente", label: "Codigo" },
          { key: "nombre_completo", label: "Nombre" },
          { key: "email", label: "Email" },
          { key: "telefono", label: "Telefono" },
          { key: "estado", label: "Estado" },
          { key: "origen", label: "Origen" },
          { key: "creado_en", label: "Creado" },
        ];
      case "contratos":
        return [
          { key: "codigo_contrato", label: "Codigo" },
          { key: "estado_contrato", label: "Estado" },
          { key: "tipo_operacion", label: "Tipo" },
          { key: "fecha_inicio", label: "Inicio" },
          { key: "fecha_fin", label: "Fin" },
          { key: "monto", label: "Monto" },
          { key: "cliente_nombre", label: "Cliente" },
          { key: "propiedad_codigo", label: "Propiedad" },
        ];
      case "operaciones":
        return [
          { key: "codigo_operacion", label: "Codigo" },
          { key: "tipo_operacion", label: "Tipo" },
          { key: "fecha_operacion", label: "Fecha" },
          { key: "estado", label: "Estado" },
          { key: "monto_operacion", label: "Monto" },
          { key: "moneda_codigo", label: "Moneda" },
          { key: "cliente_nombre", label: "Cliente" },
          { key: "propiedad_codigo", label: "Propiedad" },
        ];
      default:
        return [
          { key: "codigo_propiedad", label: "Codigo" },
          { key: "titulo", label: "Titulo" },
          { key: "estado_propiedad", label: "Estado" },
          { key: "precio", label: "Precio" },
          { key: "zona_nombre", label: "Zona" },
          { key: "zona_ciudad", label: "Ciudad" },
          { key: "creado_en", label: "Creado" },
        ];
    }
  }, [tipo]);

  const buildParams = () => {
    const params = {};
    if (fechaInicio) params.fecha_inicio = fechaInicio;
    if (fechaFin) params.fecha_fin = fechaFin;

    if (tipo === "propiedades") {
      if (estado) params.estado_propiedad = estado;
      if (ciudad) params.ciudad = ciudad;
      if (zona) params.zona = zona;
    }

    if (tipo === "clientes") {
      if (estado) params.estado = estado;
      if (origen) params.origen = origen;
    }

    if (tipo === "contratos") {
      if (estado) params.estado_contrato = estado;
      if (tipoOperacion) params.tipo_operacion = tipoOperacion;
    }

    if (tipo === "operaciones") {
      if (estado) params.estado = estado;
      if (tipoOperacion) params.tipo_operacion = tipoOperacion;
    }

    return params;
  };

  const handleGenerar = async () => {
    if (!tenantId) {
      toast.error("Selecciona un tenant para generar el reporte");
      return;
    }
    setLoading(true);
    try {
      const results = tenantId === "all"
        ? await fetchReporteGlobal(tipo, buildParams())
        : await fetchReporte(tipo, buildParams(), tenantId);
      setData(Array.isArray(results) ? results : []);
      if (!results || results.length === 0) {
        toast("Sin resultados para los filtros seleccionados");
      }
    } catch (error) {
      toast.error("Error al generar reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = async () => {
    if (!tenantId) {
      toast.error("Selecciona un tenant para descargar el reporte");
      return;
    }
    // Generación falsa client-side: crear archivos con datos mock y descargarlos
    setLoading(true);
    try {
      // Usar datos actuales si existen, sino generar mock
      const headers = columnas.map((c) => c.label);
      const rows = data.length > 0 ? data.map((r) => columnas.map((c) => r[c.key] ?? "")) : [
        columnas.map((c) => `Mock ${c.label} 1`),
        columnas.map((c) => `Mock ${c.label} 2`),
        columnas.map((c) => `Mock ${c.label} 3`),
      ];

      let blob;
      let filename;
      if (downloadFormat === 'excel') {
        // generar CSV que Excel puede abrir
        const csvLines = [headers.join(','), ...rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(','))];
        blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        filename = `reporte_${tipo}.csv`;
      } else if (downloadFormat === 'html') {
        const thead = '<tr>' + headers.map((h) => `<th>${h}</th>`).join('') + '</tr>';
        const tbody = rows.map((r) => '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('');
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Reporte</title></head><body><h1>Reporte ${tipo}</h1><table border="1">${thead}${tbody}</table></body></html>`;
        blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
        filename = `reporte_${tipo}.html`;
      } else {
        // generar PDF mínimo válido con texto
        const pdfBlob = generateSimplePdfBlob(`Reporte ${tipo}`, headers, rows);
        blob = pdfBlob;
        filename = `reporte_${tipo}.pdf`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error al generar archivo');
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers client-side para generar PDF muy simple ---
  const escapePdfText = (txt) => {
    return String(txt).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  const generateSimplePdfBlob = (title, headers, rows) => {
    // Mejora: usar fuente Courier, columnas de ancho fijo, título centrado, separador y paginación.
    const encoder = new TextEncoder();
    const pageWidth = 612;
    const pageHeight = 792;
    const marginLeft = 40;
    const marginRight = 40;
    const usableWidth = pageWidth - marginLeft - marginRight;

    const titleFontSize = 18;
    const headerFontSize = 11;
    const rowFontSize = 10;

    // Aproximación ancho por caracter en Courier: ~0.6 * fontSize
    const avgCharWidth = 0.6 * rowFontSize;
    const cols = headers.length || 1;
    const colCharCount = Math.floor((usableWidth / cols) / avgCharWidth);

    const padCell = (text, len) => {
      const s = String(text ?? '');
      if (s.length > len - 1) return s.substring(0, len - 1);
      return s + ' '.repeat(len - s.length);
    };

    let content = '';
    let y = pageHeight - 50;

    // título centrado (aprox)
    const approxTitleWidth = title.length * titleFontSize * 0.6;
    const titleX = Math.max(marginLeft, Math.floor((pageWidth - approxTitleWidth) / 2));
    content += `BT /F1 ${titleFontSize} Tf ${titleX} ${y} Td (${escapePdfText(title)}) Tj ET\n`;
    y -= 28;

    // header
    const headerLine = headers.map((h) => padCell(h.toString().toUpperCase(), colCharCount)).join(' ');
    content += `BT /F1 ${headerFontSize} Tf ${marginLeft} ${y} Td (${escapePdfText(headerLine)}) Tj ET\n`;
    y -= 14;
    // línea separadora
    content += `0.5 w ${marginLeft} ${y} m ${pageWidth - marginRight} ${y} l S\n`;
    y -= 10;

    // filas
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const line = r.map((c) => padCell(c, colCharCount)).join(' ');
      content += `BT /F1 ${rowFontSize} Tf ${marginLeft} ${y} Td (${escapePdfText(line)}) Tj ET\n`;
      y -= 14;
      if (y < 60) {
        // nueva página: crear objetos de página adicionales en la salida (manejo en ensamblado)
        content += '%%PAGEBREAK%%';
        y = pageHeight - 50;
      }
    }

    // Ensamblar objetos PDF simples, separando páginas
    const pagesContent = content.split('%%PAGEBREAK%%');
    const parts = [];
    parts.push('%PDF-1.1\n%\u00E2\u00E3\u00CF\u00D3\n');

    // objeto catálogo y pages serán creados después
    parts.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    parts.push('2 0 obj\n<< /Type /Pages /Kids [');
    // placeholder for kids, will close later
    // We'll append the rest after computing offsets

    const pageObjs = [];
    const fontObj = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n';

    // create each page object and content object
    let objIndex = 5; // content objects will start from 5
    const pageRefs = [];
    const streamObjects = [];
    for (let p = 0; p < pagesContent.length; p++) {
      const pageStream = pagesContent[p];
      const streamBody = pageStream;
      const streamBytes = encoder.encode(streamBody);
      const contentObj = `${objIndex} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${streamBody}\nendstream\nendobj\n`;
      streamObjects.push(contentObj);
      const pageObj = `${objIndex + 1} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents ${objIndex} 0 R >>\nendobj\n`;
      pageObjs.push(pageObj);
      pageRefs.push(`${objIndex + 1} 0 R `);
      objIndex += 2;
    }

    // close pages kids
    parts.push(pageRefs.join('') + '] /Count ' + pagesContent.length + ' >>\nendobj\n');
    parts.push('3 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n');
    // Actually replace pages with correct ones: we'll include font, then content and page objs
    parts.push(fontObj);
    // add stream objects and page objects
    for (const s of streamObjects) parts.push(s);
    for (const pObj of pageObjs) parts.push(pObj);

    // rebuild catalog to point to first pages object (2 0 R is pages)
    // xref
    let offset = 0;
    const encodedParts = parts.map((p) => encoder.encode(p));
    const offsets = [];
    for (const ep of encodedParts) {
      offsets.push(offset);
      offset += ep.length;
    }
    const xrefStart = offset;
    let xref = 'xref\n0 ' + (parts.length + 1) + '\n0000000000 65535 f \n';
    for (const off of offsets) {
      xref += String(off).padStart(10, '0') + ' 00000 n \n';
    }
    const trailer = `trailer\n<< /Size ${parts.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    const full = parts.join('') + xref + trailer;
    return new Blob([full], { type: 'application/pdf' });
  };

  const estadoOptions = useMemo(() => {
    if (tipo === "clientes") return ESTADOS_CLIENTE;
    if (tipo === "contratos") return ESTADOS_CONTRATO;
    if (tipo === "operaciones") return ESTADOS_OPERACION;
    return [];
  }, [tipo]);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-white to-indigo-50" />
        <div className="relative px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Reportes Globales
            </h1>
            <p className="text-sm text-slate-500">Genera reportes por periodo y estado para toda la plataforma.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerar}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Generando..." : "Generar"}
            </button>
            <div className="flex items-center gap-2">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="px-2 py-2 text-xs border rounded-lg"
                disabled={loading}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="html">HTML</option>
              </select>
              <button
                onClick={handleDescargar}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 inline-block mr-1" />
                Descargar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
          <Filter className="w-4 h-4" />
          Filtros
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500">Tenant</label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs border rounded-lg"
              disabled={loadingTenants}
            >
              <option value="">Selecciona tenant</option>
              <option value="all">Todos los tenants</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre || t.razon_social || t.dominio || `Tenant ${t.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">Tipo de reporte</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {REPORT_TYPES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setTipo(item.key);
                      setEstado("");
                      setTipoOperacion("");
                    }}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-2 ${tipo === item.key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Periodo</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-2 py-2 text-xs border rounded-lg"
              />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-2 py-2 text-xs border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs border rounded-lg"
            >
              <option value="">Todos</option>
              {estadoOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Extras</label>
            {tipo === "propiedades" && (
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full px-2 py-2 text-xs border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Zona"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="w-full px-2 py-2 text-xs border rounded-lg"
                />
              </div>
            )}

            {tipo === "clientes" && (
              <select
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-xs border rounded-lg"
              >
                <option value="">Origen</option>
                {ORIGEN_CLIENTE.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {(tipo === "contratos" || tipo === "operaciones") && (
              <select
                value={tipoOperacion}
                onChange={(e) => setTipoOperacion(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-xs border rounded-lg"
              >
                <option value="">Tipo de operacion</option>
                {TIPOS_OPERACION.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw className="w-3 h-3" />
          {data.length} resultados cargados
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detalle del reporte</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400">Cargando reporte...</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-slate-400">Sin datos para mostrar. Ajusta los filtros y genera el reporte.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  {columnas.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-bold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                    {columnas.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {row[col.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
