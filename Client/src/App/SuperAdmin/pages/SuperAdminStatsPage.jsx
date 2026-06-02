import { useMemo, useState } from "react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
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
  { value: "6m", label: "Últimos 6 meses" },
  { value: "12m", label: "Últimos 12 meses" },
  { value: "ytd", label: "Año en curso" },
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

const monthsByPeriod = {
  "6m": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  "12m": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  ytd: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
};

const createSeededRandom = (seed) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const buildDashboardData = (tipo, period, refreshSeed) => {
  const months = monthsByPeriod[period] || monthsByPeriod["6m"];
  const seedBase = `${tipo}-${period}-${refreshSeed}`.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rnd = createSeededRandom(seedBase);
  const palette = colorSets[tipo];

  const baseSeries = months.map((_, index) => {
    const trend = 1 + index * 2 + Math.round(rnd() * 7);
    return Math.max(5, trend);
  });

  const statusLabelsByType = {
    propiedades: ["Disponibles", "Reservadas", "Vendidas", "Alquiler"],
    clientes: ["Nuevos", "En seguimiento", "Activos", "Inactivos"],
    contratos: ["Borrador", "Activos", "Vencidos", "Cerrados"],
    operaciones: ["Abiertas", "Cerradas", "Anuladas", "Pendientes"],
  };

  const detailLabelsByType = {
    propiedades: ["Casas premium", "Departamentos", "Locales", "Terrenos", "Oficinas"],
    clientes: ["Canal web", "Referidos", "Campañas", "Orgánico", "Agentes"],
    contratos: ["Venta", "Alquiler", "Anticrético", "Renovación", "Administración"],
    operaciones: ["Venta", "Reserva", "Pago", "Cancelación", "Cierre"],
  };

  const rowLabelsByType = {
    propiedades: ["P-210", "P-338", "P-452", "P-608", "P-771", "P-812"],
    clientes: ["CL-102", "CL-204", "CL-318", "CL-455", "CL-509", "CL-633"],
    contratos: ["CT-011", "CT-027", "CT-033", "CT-044", "CT-058", "CT-067"],
    operaciones: ["OP-101", "OP-140", "OP-156", "OP-208", "OP-277", "OP-294"],
  };

  const statusLabels = statusLabelsByType[tipo];
  const detailLabels = detailLabelsByType[tipo];
  const rowLabels = rowLabelsByType[tipo];

  const statusValues = statusLabels.map((_, index) => 6 + Math.round(rnd() * 14) + index * 2);
  const detailValues = detailLabels.map((_, index) => 8 + Math.round(rnd() * 12) + index * 2);
  const lineValues = baseSeries.map((value, index) => value + Math.round(rnd() * 4) + index);

  const totals = lineValues.reduce((acc, value) => acc + value, 0);
  const active = Math.max(1, Math.round(totals * (0.58 + rnd() * 0.18)));
  const closed = Math.max(1, Math.round(totals * (0.21 + rnd() * 0.12)));
  const pending = Math.max(1, totals - active - closed);

  const trend = lineValues.map((value, index) => ({
    month: months[index],
    value,
  }));

  const rows = rowLabels.map((code, index) => {
    const amount = 1800 + Math.round(rnd() * 12000) + index * 650;
    return {
      codigo: code,
      nombre: detailLabels[index % detailLabels.length],
      estado: statusLabels[index % statusLabels.length],
      monto: amount,
      referencia: `${tipo.slice(0, 2).toUpperCase()}-${100 + index}`,
      progreso: 35 + Math.round(rnd() * 60),
    };
  });

  const cards = [
    {
      label: "Volumen total",
      value: Math.max(10, totals),
      suffix: "registros",
      detail: "+18% vs. mes anterior",
    },
    {
      label: "Activos",
      value: Math.max(3, active),
      suffix: "activos",
      detail: "Crecimiento constante",
    },
    {
      label: "Cerrados",
      value: Math.max(2, closed),
      suffix: "cerrados",
      detail: "Conversión saludable",
    },
    {
      label: "Pendientes",
      value: Math.max(1, pending),
      suffix: "por cerrar",
      detail: "Seguimiento requerido",
    },
  ];

  return {
    months,
    palette,
    statusLabels,
    statusValues,
    detailLabels,
    detailValues,
    trend,
    cards,
    rows,
  };
};

const exportRowsToCsv = (rows) => {
  const headers = ["Código", "Elemento", "Estado", "Monto", "Referencia", "Progreso"];
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
        <td>${formatCurrency(row.monto)}</td>
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
  <h1>Reporte mock de ${tipo}</h1>
  <p>Generado desde el frontend con datos simulados.</p>
  <div class="grid">${metricsHtml}</div>
  <table>
    <thead>
      <tr><th>Código</th><th>Elemento</th><th>Estado</th><th>Monto</th><th>Referencia</th><th>Progreso</th></tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`;

  return new Blob([html], { type: "text/html;charset=utf-8;" });
};

const exportRowsToPdf = (tipo, rows, cards) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(`Reporte mock de ${tipo}`, margin, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Dashboard estadístico generado con datos simulados desde el frontend", margin, 70);

  let x = margin;
  const cardTop = 140;
  const cardWidth = 170;
  const cardGap = 14;
  cards.forEach((card, index) => {
    const cardX = x + index * (cardWidth + cardGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX, cardTop, cardWidth, 86, 14, 14, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, cardTop, cardWidth, 86, 14, 14, "S");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.text(card.label.toUpperCase(), cardX + 14, cardTop + 22);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(String(card.value), cardX + 14, cardTop + 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(99, 102, 241);
    doc.text(card.detail, cardX + 14, cardTop + 72, { maxWidth: cardWidth - 28 });
  });

  autoTable(doc, {
    startY: 250,
    head: [["Código", "Elemento", "Estado", "Monto", "Referencia", "Progreso"]],
    body: rows.map((row) => [
      row.codigo,
      row.nombre,
      row.estado,
      formatCurrency(row.monto),
      row.referencia,
      `${row.progreso}%`,
    ]),
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 8,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  return doc.output("blob");
};

export const SuperAdminStatsPage = () => {
  const [tipo, setTipo] = useState("propiedades");
  const [periodo, setPeriodo] = useState("6m");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [refreshSeed, setRefreshSeed] = useState(1);

  const dashboard = useMemo(
    () => buildDashboardData(tipo, periodo, refreshSeed),
    [tipo, periodo, refreshSeed],
  );

  const handleGenerar = () => {
    setRefreshSeed((value) => value + 1);
    toast.success("Datoss regenerados");
  };

  const handleDescargar = () => {
    const blob =
      downloadFormat === "pdf"
        ? exportRowsToPdf(tipo, dashboard.rows, dashboard.cards)
        : downloadFormat === "excel"
          ? exportRowsToCsv(dashboard.rows)
          : exportRowsToHtml(tipo, dashboard.rows, dashboard.cards);

    const extension = downloadFormat === "excel" ? "csv" : downloadFormat;
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `reporte_mock_${tipo}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const selectedType = REPORT_TYPES.find((item) => item.key === tipo) ?? REPORT_TYPES[0];

  const chartData = useMemo(
    () => ({
      doughnut: {
        labels: dashboard.statusLabels,
        datasets: [
          {
            data: dashboard.statusValues,
            backgroundColor: dashboard.palette,
            borderColor: "#ffffff",
            borderWidth: 4,
            hoverOffset: 10,
          },
        ],
      },
      bar: {
        labels: dashboard.detailLabels,
        datasets: [
          {
            label: "Distribución",
            data: dashboard.detailValues,
            backgroundColor: dashboard.palette.map((color) => `${color}CC`),
            borderRadius: 16,
            borderSkipped: false,
          },
        ],
      },
      line: {
        labels: dashboard.months,
        datasets: [
          {
            label: "Tendencia",
            data: dashboard.trend.map((item) => item.value),
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

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-4 rounded-3xl md:p-6">
      <header className={`relative overflow-hidden rounded-3xl border border-white/60 bg-linear-to-r ${selectedType.accent} shadow-[0_25px_80px_rgba(15,23,42,0.22)] text-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="relative px-6 py-6 md:px-8 md:py-8 flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard estadístico mock
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <FileText className="h-8 w-8 md:h-10 md:w-10" />
                Estadísticos visuales para {selectedType.label}
              </h1>
              <p className="text-sm md:text-base text-white/85 max-w-xl">
                Métricas simuladas, gráficos atractivos y descarga de reporte desde el frontend sin depender del backend.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
              <button
                onClick={handleGenerar}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerar
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
                <div className="mt-2 text-3xl font-black">{card.value}</div>
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tipo de análisis</p>
              <h2 className="text-lg font-black text-slate-800">Selecciona una vista</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Semilla {refreshSeed}
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
                    Panel con métricas y tendencias mock.
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Estado visual</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Ritmo de crecimiento</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">+24%</span>
                <span className="text-xs font-semibold text-emerald-600">+4.1% vs anterior</span>
              </div>
            </div>
            <div className="rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 p-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Cobertura</p>
              <div className="mt-2 text-3xl font-black">97%</div>
              <p className="mt-1 text-xs text-white/80">Datos mock listos para demo visual.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Distribución</p>
            <h3 className="text-lg font-black text-slate-800">Estados principales</h3>
          </div>
          <div className="h-80">
            <Doughnut
              data={chartData.doughnut}
              options={{
                ...chartOptions,
                cutout: "68%",
                plugins: { ...chartOptions.plugins, legend: { position: "bottom", labels: chartOptions.plugins.legend.labels } },
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Impacto</p>
            <h3 className="text-lg font-black text-slate-800">Segmentación por canal</h3>
          </div>
          <div className="h-80">
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
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tendencia</p>
            <h3 className="text-lg font-black text-slate-800">Evolución mensual</h3>
          </div>
          <div className="h-80">
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
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Detalle mock</p>
            <h3 className="text-lg font-black text-slate-800">Últimos registros simulados</h3>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {dashboard.rows.length} filas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Elemento</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Referencia</th>
                <th className="px-5 py-3">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rows.map((row, index) => (
                <tr key={row.codigo} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-t border-slate-100`}>
                  <td className="px-5 py-4 font-semibold text-slate-900">{row.codigo}</td>
                  <td className="px-5 py-4 text-slate-600">{row.nombre}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{formatCurrency(row.monto)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
