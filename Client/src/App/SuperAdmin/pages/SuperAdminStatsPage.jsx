import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  LoaderCircle,
  Building2,
  Download,
  FileSignature,
  FileText,
  Layers,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  downloadReporteGlobalPdf,
  fetchReporteGlobal,
} from "../api/reportesApi";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

const REPORT_TYPES = [
  { key: "propiedades", label: "Propiedades", icon: Building2, accent: "from-cyan-500 to-blue-600" },
  { key: "clientes", label: "Clientes", icon: Users, accent: "from-emerald-500 to-teal-600" },
  { key: "contratos", label: "Contratos", icon: FileSignature, accent: "from-amber-500 to-orange-600" },
  { key: "operaciones", label: "Operaciones", icon: Layers, accent: "from-fuchsia-500 to-pink-600" },
];

const PERIODS = [
  { value: "6m", label: "Ultimos 6 meses" },
  { value: "12m", label: "Ultimos 12 meses" },
  { value: "ytd", label: "Ano en curso" },
];

const DOWNLOAD_FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel (CSV)" },
  { value: "html", label: "HTML" },
];

const colorSets = {
  propiedades: ["#06b6d4", "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b"],
  clientes: ["#10b981", "#14b8a6", "#06b6d4", "#84cc16", "#f97316"],
  contratos: ["#f59e0b", "#fb7185", "#f97316", "#eab308", "#a855f7"],
  operaciones: ["#ec4899", "#d946ef", "#8b5cf6", "#3b82f6", "#14b8a6"],
};

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const TYPE_CONFIG = {
  propiedades: {
    codeField: "codigo_propiedad",
    nameField: "titulo",
    statusField: "estado_propiedad",
    amountField: "precio",
    dateField: "creado_en",
    segmentField: "zona_ciudad",
    segmentLabel: "Distribucion por ciudad",
    statusLabel: "Estados de propiedad",
    tableLabel: "Ultimas propiedades registradas",
  },
  clientes: {
    codeField: "codigo_cliente",
    nameField: "nombre_completo",
    statusField: "estado",
    amountField: null,
    dateField: "creado_en",
    segmentField: "origen",
    segmentLabel: "Distribucion por origen",
    statusLabel: "Estados de cliente",
    tableLabel: "Ultimos clientes registrados",
  },
  contratos: {
    codeField: "codigo_contrato",
    nameField: "cliente_nombre",
    statusField: "estado_contrato",
    amountField: "monto",
    dateField: "fecha_inicio",
    segmentField: "tipo_operacion",
    segmentLabel: "Distribucion por tipo de operacion",
    statusLabel: "Estados de contrato",
    tableLabel: "Ultimos contratos registrados",
  },
  operaciones: {
    codeField: "codigo_operacion",
    nameField: "cliente_nombre",
    statusField: "estado",
    amountField: "monto_operacion",
    dateField: "fecha_operacion",
    segmentField: "tipo_operacion",
    segmentLabel: "Distribucion por tipo de operacion",
    statusLabel: "Estados de operacion",
    tableLabel: "Ultimas operaciones registradas",
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDateRangeForPeriod = (period) => {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (period === "ytd") {
    const start = new Date(today.getFullYear(), 0, 1);
    return {
      fecha_inicio: start.toISOString().slice(0, 10),
      fecha_fin: end.toISOString().slice(0, 10),
    };
  }

  const months = period === "12m" ? 11 : 5;
  const start = new Date(today.getFullYear(), today.getMonth() - months, 1);

  return {
    fecha_inicio: start.toISOString().slice(0, 10),
    fecha_fin: end.toISOString().slice(0, 10),
  };
};

const createCountMap = (items, getter) => {
  const map = new Map();
  items.forEach((item) => {
    const key = getter(item) || "Sin datos";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

const normalizeRows = (rows, tipo) => {
  const config = TYPE_CONFIG[tipo];
  const amountField = config.amountField;
  const maxAmount = Math.max(
    ...rows.map((row) => Number(amountField ? row[amountField] : 0) || 0),
    0,
  );

  return [...rows]
    .sort((a, b) => {
      const aDate = parseDate(a[config.dateField])?.getTime() || 0;
      const bDate = parseDate(b[config.dateField])?.getTime() || 0;
      return bDate - aDate;
    })
    .slice(0, 8)
    .map((row) => {
      const amount = Number(amountField ? row[amountField] : 0) || 0;
      return {
        codigo: row[config.codeField] || "Sin codigo",
        nombre: row[config.nameField] || "Sin nombre",
        estado: row[config.statusField] || "Sin estado",
        monto: amount,
        fecha: row[config.dateField] || null,
        referencia: row[config.segmentField] || row.propiedad_codigo || row.moneda_codigo || "Sin referencia",
        progreso: maxAmount > 0 ? Math.max(8, Math.round((amount / maxAmount) * 100)) : 0,
      };
    });
};

const buildDashboardData = (rows, tipo, period) => {
  const config = TYPE_CONFIG[tipo];
  const palette = colorSets[tipo];
  const dateRange = getDateRangeForPeriod(period);
  const start = parseDate(dateRange.fecha_inicio);
  const end = parseDate(dateRange.fecha_fin);
  const amountField = config.amountField;
  const statusField = config.statusField;
  const segmentField = config.segmentField;
  const dateField = config.dateField;

  const filteredRows = rows.filter((row) => {
    const date = parseDate(row[dateField]);
    if (!date || !start || !end) return true;
    return date >= start && date <= end;
  });

  const totalAmount = filteredRows.reduce(
    (acc, row) => acc + (Number(amountField ? row[amountField] : 0) || 0),
    0,
  );

  const statusCounts = createCountMap(filteredRows, (row) => row[statusField]);
  const segmentCounts = createCountMap(filteredRows, (row) => row[segmentField]);
  const statusLabels = statusCounts.slice(0, 5).map(([label]) => label);
  const statusValues = statusCounts.slice(0, 5).map(([, value]) => value);
  const detailLabels = segmentCounts.slice(0, 6).map(([label]) => label);
  const detailValues = segmentCounts.slice(0, 6).map(([, value]) => value);

  const monthMap = new Map();
  filteredRows.forEach((row) => {
    const date = parseDate(row[dateField]);
    if (!date) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });

  const trend = [...monthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => {
      const [year, month] = key.split("-");
      return {
        month: `${MONTH_LABELS[Number(month) - 1]} ${year}`,
        value,
      };
    });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const recordsThisMonth = filteredRows.filter((row) => {
    const date = parseDate(row[dateField]);
    return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const cards = [
    {
      label: "Registros totales",
      value: filteredRows.length,
      detail: `Periodo ${dateRange.fecha_inicio} a ${dateRange.fecha_fin}`,
    },
    {
      label: amountField ? "Monto acumulado" : "Con fecha registrada",
      value: amountField ? formatCurrency(totalAmount) : filteredRows.filter((row) => parseDate(row[dateField])).length,
      detail: amountField ? "Suma de montos visibles" : "Registros con fecha utilizable",
    },
    {
      label: "Estado dominante",
      value: statusCounts[0]?.[0] || "Sin datos",
      detail: `${statusCounts[0]?.[1] || 0} registros`,
    },
    {
      label: "Altas este mes",
      value: recordsThisMonth,
      detail: "Registros fechados en el mes actual",
    },
  ];

  return {
    palette,
    cards,
    rows: normalizeRows(filteredRows, tipo),
    trend,
    statusLabels,
    statusValues,
    detailLabels,
    detailValues,
    totalRows: filteredRows.length,
  };
};

const exportRowsToCsv = (rows) => {
  const headers = ["Codigo", "Elemento", "Estado", "Monto", "Referencia", "Participacion"];
  const csvRows = rows.map((row) => [row.codigo, row.nombre, row.estado, row.monto, row.referencia, row.progreso]);
  const csv = [headers, ...csvRows]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
};

const exportRowsToHtml = (tipo, rows, cards) => {
  const rowsHtml = rows
    .map(
      (row) => `<tr>
        <td>${row.codigo}</td>
        <td>${row.nombre}</td>
        <td>${row.estado}</td>
        <td>${row.monto ? formatCurrency(row.monto) : "-"}</td>
        <td>${row.referencia}</td>
        <td>${row.progreso}%</td>
      </tr>`,
    )
    .join("");

  const metricsHtml = cards
    .map(
      (card) => `<div style="padding:16px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 8px 30px rgba(15,23,42,.08)">
        <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.12em">${card.label}</div>
        <div style="font-size:28px;font-weight:800;margin:6px 0">${card.value}</div>
        <div style="font-size:12px;color:#0f172a">${card.detail}</div>
      </div>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Reporte ${tipo}</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 0; padding: 32px; background: linear-gradient(180deg, #f8fafc, #eef2ff); color: #0f172a; }
    h1 { margin: 0 0 16px; font-size: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; overflow: hidden; border-radius: 16px; background: white; box-shadow: 0 12px 32px rgba(15,23,42,.08); }
    th, td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 13px; }
    th { background: #0f172a; color: white; }
    tr:nth-child(even) td { background: #f8fafc; }
    .grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; margin-bottom: 24px; }
    @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <h1>Reporte real de ${tipo}</h1>
  <p>Generado desde el panel SuperAdmin con datos obtenidos del backend.</p>
  <div class="grid">${metricsHtml}</div>
  <table>
    <thead>
      <tr><th>Codigo</th><th>Elemento</th><th>Estado</th><th>Monto</th><th>Referencia</th><th>Participacion</th></tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`;

  return new Blob([html], { type: "text/html;charset=utf-8;" });
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const SuperAdminStatsPage = () => {
  const [tipo, setTipo] = useState("propiedades");
  const [periodo, setPeriodo] = useState("6m");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchReporteGlobal(tipo, getDateRangeForPeriod(periodo));
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setRows([]);
        setError(err);
        toast.error("No se pudieron cargar las estadisticas globales");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tipo, periodo, refreshKey]);

  const selectedType = REPORT_TYPES.find((item) => item.key === tipo) ?? REPORT_TYPES[0];

  const dashboard = useMemo(
    () => buildDashboardData(rows, tipo, periodo),
    [rows, tipo, periodo],
  );

  const chartData = useMemo(
    () => ({
      doughnut: {
        labels: dashboard.statusLabels.length ? dashboard.statusLabels : ["Sin datos"],
        datasets: [
          {
            data: dashboard.statusValues.length ? dashboard.statusValues : [1],
            backgroundColor: dashboard.statusValues.length ? dashboard.palette : ["#cbd5e1"],
            borderColor: "#ffffff",
            borderWidth: 4,
            hoverOffset: 10,
          },
        ],
      },
      bar: {
        labels: dashboard.detailLabels.length ? dashboard.detailLabels : ["Sin datos"],
        datasets: [
          {
            label: "Distribucion",
            data: dashboard.detailValues.length ? dashboard.detailValues : [0],
            backgroundColor: dashboard.detailValues.length
              ? dashboard.palette.map((color) => `${color}CC`)
              : ["#cbd5e1"],
            borderRadius: 16,
            borderSkipped: false,
          },
        ],
      },
      line: {
        labels: dashboard.trend.length ? dashboard.trend.map((item) => item.month) : ["Sin datos"],
        datasets: [
          {
            label: "Tendencia",
            data: dashboard.trend.length ? dashboard.trend.map((item) => item.value) : [0],
            borderColor: dashboard.palette[1],
            backgroundColor: `${dashboard.palette[1]}22`,
            pointBackgroundColor: dashboard.palette[0],
            pointBorderWidth: 3,
            pointRadius: 5,
            fill: true,
            tension: 0.45,
          },
        ],
      },
    }),
    [dashboard],
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          color: "#475569",
        },
      },
    },
  };

  const handleGenerar = () => {
    setRefreshKey((value) => value + 1);
    toast.success("Estadisticas actualizadas");
  };

  const handleDescargar = async () => {
    try {
      const params = getDateRangeForPeriod(periodo);

      if (downloadFormat === "pdf") {
        const blob = await downloadReporteGlobalPdf(tipo, params);
        downloadBlob(blob, `reporte_global_${tipo}.pdf`);
        return;
      }

      const blob =
        downloadFormat === "excel"
          ? exportRowsToCsv(dashboard.rows)
          : exportRowsToHtml(tipo, dashboard.rows, dashboard.cards);

      const extension = downloadFormat === "excel" ? "csv" : "html";
      downloadBlob(blob, `reporte_global_${tipo}.${extension}`);
    } catch {
      toast.error("No se pudo descargar el reporte");
    }
  };

  if (loading && rows.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-8 shadow-sm">
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200">
            <LoaderCircle className="h-10 w-10 animate-spin text-cyan-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Cargando estadisticas globales</h2>
            <p className="max-w-md text-sm text-slate-500">
              Estamos consultando los datos reales del sistema para construir el panel de SuperAdmin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4 rounded-3xl md:p-6">
      <header className={`relative overflow-hidden rounded-3xl border border-white/60 bg-linear-to-r ${selectedType.accent} shadow-[0_25px_80px_rgba(15,23,42,0.22)] text-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="relative px-6 py-6 md:px-8 md:py-8 flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard global en tiempo real
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <FileText className="h-8 w-8 md:h-10 md:w-10" />
                Estadisticas visuales para {selectedType.label}
              </h1>
              <p className="text-sm md:text-base text-white/85 max-w-xl">
                Resumen global construido con datos reales del backend para soporte de decisiones del SuperAdmin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <button
                onClick={handleGenerar}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {DOWNLOAD_FORMATS.map((format) => (
                    <option key={format.value} value={format.value} className="text-slate-900">
                      {format.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDescargar}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950/80 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-950"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dashboard.cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-white/15 bg-white/12 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/75">{card.label}</p>
                <div className="mt-2 text-2xl md:text-3xl font-black break-words">{card.value}</div>
                <p className="mt-1 text-xs text-white/80">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tipo de analisis</p>
              <h2 className="text-lg font-black text-slate-800">Selecciona una vista</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {dashboard.totalRows} registros
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {REPORT_TYPES.map((item) => {
              const Icon = item.icon;
              const active = tipo === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTipo(item.key)}
                  className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${active ? `border-transparent bg-linear-to-br ${item.accent} text-white shadow-lg scale-[1.01]` : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"}`}
                >
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold">{item.label}</div>
                  <p className={`mt-1 text-xs ${active ? "text-white/80" : "text-slate-500"}`}>
                    Vista consolidada con datos globales reales.
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Periodo</p>
          <div className="mt-3 space-y-2">
            {PERIODS.map((item) => {
              const active = periodo === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setPeriodo(item.value)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active ? "bg-slate-900 text-white shadow-md" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Estado de carga</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Sincronizacion</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {loading ? "Cargando" : error ? "Error" : "Lista"}
                </span>
              </div>
              <span className={`text-xs font-semibold ${error ? "text-rose-600" : "text-emerald-600"}`}>
                {error ? "Revisa la conexion o permisos" : "Datos recibidos desde backend"}
              </span>
            </div>
            <div className="rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 p-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Cobertura</p>
              <div className="mt-2 text-3xl font-black">{dashboard.totalRows}</div>
              <p className="mt-1 text-xs text-white/80">Registros incluidos en el periodo seleccionado.</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          No se pudieron cargar las estadisticas globales para {selectedType.label.toLowerCase()}.
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Distribucion</p>
            <h3 className="text-lg font-black text-slate-800">{TYPE_CONFIG[tipo].statusLabel}</h3>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <Doughnut
                data={chartData.doughnut}
                options={{
                  ...chartOptions,
                  cutout: "68%",
                  plugins: { ...chartOptions.plugins, legend: { position: "bottom", labels: chartOptions.plugins.legend.labels } },
                }}
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Impacto</p>
            <h3 className="text-lg font-black text-slate-800">{TYPE_CONFIG[tipo].segmentLabel}</h3>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <Bar
                data={chartData.bar}
                options={{
                  ...chartOptions,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: "#64748b" } },
                    y: { grid: { color: "rgba(148,163,184,.18)" }, ticks: { color: "#64748b" } },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tendencia</p>
            <h3 className="text-lg font-black text-slate-800">Evolucion mensual</h3>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <Line
                data={chartData.line}
                options={{
                  ...chartOptions,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: "#64748b" } },
                    y: { grid: { color: "rgba(148,163,184,.18)" }, ticks: { color: "#64748b" } },
                  },
                }}
              />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Detalle real</p>
            <h3 className="text-lg font-black text-slate-800">{TYPE_CONFIG[tipo].tableLabel}</h3>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {dashboard.rows.length} filas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Codigo</th>
                <th className="px-5 py-3">Elemento</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Referencia</th>
                <th className="px-5 py-3">Participacion</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rows.length > 0 ? (
                dashboard.rows.map((row, index) => (
                  <tr key={`${row.codigo}-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-t border-slate-100`}>
                    <td className="px-5 py-4 font-semibold text-slate-900">{row.codigo}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <div className="font-medium">{row.nombre}</div>
                      <div className="text-xs text-slate-400">{formatDate(row.fecha)}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{row.monto ? formatCurrency(row.monto) : "-"}</td>
                    <td className="px-5 py-4 text-slate-600">{row.referencia}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500"
                            style={{ width: `${row.progreso}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{row.progreso}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                    {loading ? "Cargando registros..." : "No hay datos para el periodo seleccionado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
