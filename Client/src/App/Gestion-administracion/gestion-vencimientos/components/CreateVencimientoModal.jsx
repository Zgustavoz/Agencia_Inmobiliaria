import { useState } from "react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { crearVencimiento } from "../api/vencimientoApi"

export const CreateVencimientoModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    tipo: "Contrato",
    codigo: "",
    titulo: "",
    fecha_vencimiento: "",
    estado: "VIGENTE",
    responsable: "",
    detalles: "",
  })
  const [saving, setSaving] = useState(false)

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await crearVencimiento(form)
      toast.success("Vencimiento creado con éxito")
      onCreated()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("No se pudo crear el vencimiento")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Nuevo Vencimiento</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Crear registro directo</h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-600">Tipo</span>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                value={form.tipo}
                onChange={onChange("tipo")}
              >
                <option value="Contrato">Contrato</option>
                <option value="Propiedad">Propiedad</option>
                <option value="Otro">Otro</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Estado</span>
              <select
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                value={form.estado}
                onChange={onChange("estado")}
              >
                <option value="VIGENTE">Vigente</option>
                <option value="POR VENCER">Por vencer</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-600">Código</span>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                type="text"
                value={form.codigo}
                onChange={onChange("codigo")}
                placeholder="Ej. VENC-001"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Fecha de vencimiento</span>
              <input
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                type="date"
                value={form.fecha_vencimiento}
                onChange={onChange("fecha_vencimiento")}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-slate-600">Título</span>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              type="text"
              value={form.titulo}
              onChange={onChange("titulo")}
              placeholder="Título del vencimiento"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600">Responsable</span>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              type="text"
              value={form.responsable}
              onChange={onChange("responsable")}
              placeholder="Nombre del responsable"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600">Detalles</span>
            <textarea
              className="mt-1 h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              value={form.detalles}
              onChange={onChange("detalles")}
              placeholder="Descripción breve"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {saving ? "Guardando..." : "Crear vencimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
