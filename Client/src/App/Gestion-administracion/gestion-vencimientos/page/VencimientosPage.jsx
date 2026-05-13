import { useEffect, useMemo, useState } from "react"
import { Search, CalendarDays, Plus, ChevronRight } from "lucide-react"
import { obtenerVencimientos } from "../api/vencimientoApi"
import { CreateVencimientoModal } from "../components/CreateVencimientoModal"

const ESTADOS = ["Todos", "ACTIVO", "RENOVADO", "VENCIDO", "BORRADOR", "FINALIZADO", "ANULADO"]
const TIPOS = ["Todos", "Contrato", "Propiedad"]

const calcularDias = (fecha) => {
  const hoy = new Date()
  const f = new Date(fecha)
  const diff = Math.ceil((f - hoy) / (1000 * 60 * 60 * 24))
  return diff
}

export const VencimientosPage = () => {
  const [vencimientos, setVencimientos] = useState([])
  const [dias, setDias] = useState(30)
  const [cargando, setCargando] = useState(false)
  const [search, setSearch] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("Todos")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [responsableFiltro, setResponsableFiltro] = useState("Todos")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)

  const cargarVencimientos = async () => {
    setCargando(true)
    try {
      const items = await obtenerVencimientos(dias)
      setVencimientos(items)
    } catch (error) {
      console.error("Error cargando vencimientos:", error)
      setVencimientos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVencimientos()
  }, [dias])

  const responsables = useMemo(() => {
    const list = vencimientos
      .map((item) => item.responsable || "Sin responsable")
      .filter((valor, index, array) => array.indexOf(valor) === index)
    return ["Todos", ...list]
  }, [vencimientos])

  const resultadosFiltrados = useMemo(() => {
    return vencimientos.filter((item) => {
      const valorBuscado = search.trim().toLowerCase()
      const texto = `${item.tipo} ${item.codigo} ${item.titulo} ${item.responsable || ""} ${item.detalles || ""}`.toLowerCase()
      const cumpleTexto = !valorBuscado || texto.includes(valorBuscado)
      const cumpleTipo = tipoFiltro === "Todos" || item.tipo === tipoFiltro
      const cumpleEstado = estadoFiltro === "Todos" || item.estado === estadoFiltro
      const cumpleResponsable = responsableFiltro === "Todos" || (item.responsable || "Sin responsable") === responsableFiltro
      const cumpleDesde = !desde || new Date(item.fecha_vencimiento) >= new Date(desde)
      const cumpleHasta = !hasta || new Date(item.fecha_vencimiento) <= new Date(hasta)
      return cumpleTexto && cumpleTipo && cumpleEstado && cumpleResponsable && cumpleDesde && cumpleHasta
    })
  }, [vencimientos, search, tipoFiltro, estadoFiltro, responsableFiltro, desde, hasta])

  const cantidades = useMemo(() => {
    const total = vencimientos.length
    const vencidos = vencimientos.filter((item) => calcularDias(item.fecha_vencimiento) < 0).length
    const porVencer = vencimientos.filter((item) => {
      const diasRest = calcularDias(item.fecha_vencimiento)
      return diasRest >= 0 && diasRest <= dias
    }).length
    const vigentes = total - vencidos
    return { total, vencidos, porVencer, vigentes }
  }, [vencimientos, dias])

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Control y gestión de vencimientos</p>
            <h1 className="text-3xl font-semibold text-gray-900">Control de Vencimientos</h1>
            <p className="max-w-2xl text-sm text-gray-600">
              Gestiona contratos, propiedades y otros registros importantes que tienen fecha de vencimiento.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo registro
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-red-600">Vencidos</p>
            <p className="mt-4 text-4xl font-semibold text-red-700">{cantidades.vencidos}</p>
            <p className="mt-2 text-sm text-gray-500">Requieren atención</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-600">Por vencer</p>
            <p className="mt-4 text-4xl font-semibold text-amber-700">{cantidades.porVencer}</p>
            <p className="mt-2 text-sm text-gray-500">Próximos {dias} días</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Vigentes</p>
            <p className="mt-4 text-4xl font-semibold text-sky-700">{cantidades.vigentes}</p>
            <p className="mt-2 text-sm text-gray-500">Todo en orden</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Total registros</p>
            <p className="mt-4 text-4xl font-semibold text-emerald-700">{cantidades.total}</p>
            <p className="mt-2 text-sm text-gray-500">Registrados en el sistema</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                <p className="text-sm text-gray-500">Busca por tipo, estado, responsable y fechas de vencimiento.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                <CalendarDays className="w-4 h-4" />
                Próximo {dias} días
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar documento, contrato o responsable..."
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={tipoFiltro}
                onChange={(event) => setTipoFiltro(event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {TIPOS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={estadoFiltro}
                onChange={(event) => setEstadoFiltro(event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {ESTADOS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select
                value={responsableFiltro}
                onChange={(event) => setResponsableFiltro(event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {responsables.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <input
                type="date"
                value={desde}
                onChange={(event) => setDesde(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Vencimiento desde"
              />
              <input
                type="date"
                value={hasta}
                onChange={(event) => setHasta(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Vencimiento hasta"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500">Mostrando {resultadosFiltrados.length} de {vencimientos.length} registros</div>
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setTipoFiltro("Todos")
                  setEstadoFiltro("Todos")
                  setResponsableFiltro("Todos")
                  setDesde("")
                  setHasta("")
                }}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Próximos vencimientos</p>
                  <p className="mt-1 text-sm text-gray-500">Los eventos más cercanos a vencer.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{resultadosFiltrados.length} activos</span>
              </div>

              <div className="mt-5 space-y-4">
                {resultadosFiltrados.slice(0, 5).map((item) => {
                  const diasRest = calcularDias(item.fecha_vencimiento)
                  return (
                    <div key={item.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-900">{item.tipo} · {item.codigo}</p>
                      <p className="mt-1 text-sm text-gray-500">{item.titulo}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className="text-gray-700">Vence {item.fecha_vencimiento}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${diasRest < 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                          {diasRest < 0 ? "Vencido" : `En ${diasRest} días`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Resumen rápido</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-600">Resumen</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-900">{cantidades.total} registros</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 border border-gray-200">
                    <p className="text-xs text-gray-500">Vencidos</p>
                    <p className="mt-2 text-xl font-semibold text-red-600">{cantidades.vencidos}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-gray-200">
                    <p className="text-xs text-gray-500">Por vencer</p>
                    <p className="mt-2 text-xl font-semibold text-amber-600">{cantidades.porVencer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-gray-900">Lista de vencimientos</p>
              <p className="text-sm text-gray-500">Administra los próximos registros y contratos.</p>
            </div>
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold uppercase text-gray-600">
              {resultadosFiltrados.length} resultados
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 font-semibold text-gray-900">Tipo</th>
                  <th className="px-4 py-4 font-semibold text-gray-900">Descripción</th>
                  <th className="px-4 py-4 font-semibold text-gray-900">Responsable</th>
                  <th className="px-4 py-4 font-semibold text-gray-900">Vencimiento</th>
                  <th className="px-4 py-4 font-semibold text-gray-900">Estado</th>
                  <th className="px-4 py-4 font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cargando ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Cargando vencimientos...</td>
                  </tr>
                ) : resultadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No hay registros que coincidan.</td>
                  </tr>
                ) : (
                  resultadosFiltrados.map((item) => {
                    const diasRest = calcularDias(item.fecha_vencimiento)
                    const colorEstado = diasRest < 0 ? "text-red-700 bg-red-50" : diasRest <= 7 ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50"

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.tipo}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-900">{item.codigo}</div>
                          <div className="mt-1 text-sm text-gray-500">{item.titulo}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">{item.responsable || "Sin responsable"}</td>
                        <td className="px-4 py-4 text-gray-700">{item.fecha_vencimiento}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorEstado}`}>
                            {diasRest < 0 ? "Vencido" : diasRest <= 7 ? "Por vencer" : "Vigente"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                            Ver <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <CreateVencimientoModal
          onClose={() => setMostrarModal(false)}
          onCreated={cargarVencimientos}
        />
      )}
    </div>
  )
}
