import { useState } from "react"
import { X } from "lucide-react"
import { useRol } from "../hooks/useRol"
import { usePermiso } from "../../gestion-permiso/hooks/usePermiso"

export const EditRolModal = ({ rol, onClose }) => {
  const { actualizar } = useRol()
  const { permisos }   = usePermiso()

  const [form, setForm] = useState({
    nombre:       rol.nombre       || "",
    descripcion:  rol.descripcion  || "",
    permisos_ids: rol.permisos_info?.map(p => p.id) || [],
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const handlePermisoToggle = (id) => {
    setForm(prev => ({
      ...prev,
      permisos_ids: prev.permisos_ids.includes(id)
        ? prev.permisos_ids.filter(p => p !== id)
        : [...prev.permisos_ids, id],
    }))
  }

  const validar = () => {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = "Requerido"
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    actualizar.mutate({ id: rol.id, payload: form }, { onSuccess: () => onClose() })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--surface-container-lowest) rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-(--outline-variant)/20">
          <div>
            <h2 className="text-xl font-bold text-(--on-surface)">Editar Rol</h2>
            <p className="text-sm text-(--on-surface-variant)">{rol.nombre}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-(--surface-container) rounded-lg transition">
            <X size={20} className="text-(--on-surface-variant)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-1">Nombre</label>
            <input
              type="text" name="nombre" value={form.nombre}
              onChange={handleChange} placeholder="Ej: Supervisor"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) ${
                errors.nombre ? "border-(--error)" : "border-(--outline-variant)/40"
              }`}
            />
            {errors.nombre && <p className="text-(--error) text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-1">Descripción (opcional)</label>
            <textarea
              name="descripcion" value={form.descripcion}
              onChange={handleChange} placeholder="Descripción del rol..."
              rows={3}
              className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-2">Permisos</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {permisos.data?.map(permiso => (
                <button
                  key={permiso.id} type="button"
                  onClick={() => handlePermisoToggle(permiso.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    form.permisos_ids.includes(permiso.id)
                      ? "bg-(--primary) text-(--on-primary)"
                      : "bg-(--surface-container) text-(--on-surface-variant) hover:bg-(--surface-container-high)"
                  }`}
                >
                  {permiso.nombre}
                </button>
              ))}
            </div>
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