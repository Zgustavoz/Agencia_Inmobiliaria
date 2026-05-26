import { useState } from "react"
import { X } from "lucide-react"
import { useCliente } from "../hooks/useCliente"

const ESTADOS  = ["nuevo", "seguimiento", "activo", "inactivo", "cerrado"]
const ORIGENES = ["web", "movil", "referido", "agente", "campana"]

export const EditClienteModal = ({ cliente, onClose }) => {
  const { actualizar } = useCliente()

  const [form, setForm] = useState({
    nombres:      cliente.nombres      || "",
    apellidos:    cliente.apellidos    || "",
    email:        cliente.email        || "",
    telefono:     cliente.telefono     || "",
    whatsapp:     cliente.whatsapp     || "",
    direccion:    cliente.direccion    || "",
    ocupacion:    cliente.ocupacion    || "",
    tipo_documento: cliente.tipo_documento || "CI",
    nro_documento:  cliente.nro_documento  || "",
    origen:       cliente.origen       || "web",
    estado:       cliente.estado       || "nuevo",
    observaciones: cliente.observaciones || "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const validar = () => {
    const errs = {}
    if (!form.nombres.trim())   errs.nombres   = "Requerido"
    if (!form.apellidos.trim()) errs.apellidos  = "Requerido"
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    actualizar.mutate({ id: cliente.id, payload: form }, { onSuccess: () => onClose() })
  }

  const inputClass = (name) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) ${
      errors[name] ? "border-(--error)" : "border-(--outline-variant)/40"
    }`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--surface-container-lowest) rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-(--outline-variant)/20">
          <div>
            <h2 className="text-xl font-bold text-(--on-surface)">Editar Cliente</h2>
            <p className="text-sm text-(--on-surface-variant)">{cliente.codigo_cliente}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-(--surface-container) rounded-lg transition">
            <X size={20} className="text-(--on-surface-variant)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Nombres</label>
              <input name="nombres" value={form.nombres} onChange={handleChange} className={inputClass("nombres")} />
              {errors.nombres && <p className="text-(--error) text-xs mt-1">{errors.nombres}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Apellidos</label>
              <input name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass("apellidos")} />
              {errors.apellidos && <p className="text-(--error) text-xs mt-1">{errors.apellidos}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Tipo Doc.</label>
              <select name="tipo_documento" value={form.tipo_documento} onChange={handleChange} className={inputClass("tipo_documento")}>
                <option value="CI">Cédula de Identidad</option>
                <option value="NIT">NIT</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Nro. Documento</label>
              <input name="nro_documento" value={form.nro_documento} onChange={handleChange} className={inputClass("nro_documento")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass("email")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} className={inputClass("telefono")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">WhatsApp</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass("whatsapp")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Ocupación</label>
              <input name="ocupacion" value={form.ocupacion} onChange={handleChange} className={inputClass("ocupacion")} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-1">Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass("direccion")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Origen</label>
              <select name="origen" value={form.origen} onChange={handleChange} className={inputClass("origen")}>
                {ORIGENES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className={inputClass("estado")}>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-1">Observaciones</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3}
              className={`${inputClass("observaciones")} resize-none`} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-lg hover:bg-(--surface-container) transition text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={actualizar.isPending}
              className="flex-1 px-4 py-2 bg-(--primary) text-(--on-primary) rounded-lg hover:bg-(--primary)/90 transition text-sm font-medium disabled:opacity-50">
              {actualizar.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}