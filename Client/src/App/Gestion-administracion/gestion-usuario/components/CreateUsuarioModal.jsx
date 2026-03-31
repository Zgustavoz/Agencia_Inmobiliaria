import { useState } from "react"
import { X } from "lucide-react"
import { useUsuario } from "../hooks/useUsuario"
import { useRol } from "../../gestion-rol/hooks/useRol"

export const CreateUsuarioModal = ({ onClose }) => {
  const { crear }  = useUsuario()
  const { roles }  = useRol()

  const [form, setForm] = useState({
    nombres: "", apellidos: "", username: "",
    email: "", password: "", telefono: "", roles_ids: [],
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const handleRolToggle = (id) => {
    setForm(prev => ({
      ...prev,
      roles_ids: prev.roles_ids.includes(id)
        ? prev.roles_ids.filter(r => r !== id)
        : [...prev.roles_ids, id],
    }))
  }

  const validar = () => {
    const errs = {}
    if (!form.nombres.trim())   errs.nombres   = "Requerido"
    if (!form.apellidos.trim()) errs.apellidos  = "Requerido"
    if (!form.username.trim())  errs.username   = "Requerido"
    if (!form.email.trim())     errs.email      = "Requerido"
    if (!form.password || form.password.length < 8) errs.password = "Mínimo 8 caracteres"
    if (!form.roles_ids.length) errs.roles_ids  = "Selecciona al menos un rol"
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    crear.mutate(form, { onSuccess: () => onClose() })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--surface-container-lowest) rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-(--outline-variant)/20">
          <h2 className="text-xl font-bold text-(--on-surface)">Nuevo Usuario</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-(--surface-container) rounded-lg transition">
            <X size={20} className="text-(--on-surface-variant)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "nombres",   label: "Nombres",   placeholder: "Juan" },
              { name: "apellidos", label: "Apellidos", placeholder: "Pérez" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-(--on-surface) mb-1">{f.label}</label>
                <input
                  type="text" name={f.name} value={form[f.name]}
                  onChange={handleChange} placeholder={f.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) ${
                    errors[f.name] ? "border-(--error)" : "border-(--outline-variant)/40"
                  }`}
                />
                {errors[f.name] && <p className="text-(--error) text-xs mt-1">{errors[f.name]}</p>}
              </div>
            ))}
          </div>

          {[
            { name: "username", label: "Usuario",    type: "text",     placeholder: "juanperez" },
            { name: "email",    label: "Email",      type: "email",    placeholder: "juan@email.com" },
            { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
            { name: "telefono", label: "Teléfono (opcional)", type: "text", placeholder: "+591 70000000" },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-(--on-surface) mb-1">{f.label}</label>
              <input
                type={f.type} name={f.name} value={form[f.name]}
                onChange={handleChange} placeholder={f.placeholder}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) ${
                  errors[f.name] ? "border-(--error)" : "border-(--outline-variant)/40"
                }`}
              />
              {errors[f.name] && <p className="text-(--error) text-xs mt-1">{errors[f.name]}</p>}
            </div>
          ))}

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-(--on-surface) mb-2">Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.data?.results?.map(rol => (
                <button
                  key={rol.id} type="button"
                  onClick={() => handleRolToggle(rol.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    form.roles_ids.includes(rol.id)
                      ? "bg-(--primary) text-(--on-primary)"
                      : "bg-(--surface-container) text-(--on-surface-variant) hover:bg-(--surface-container-high)"
                  }`}
                >
                  {rol.nombre}
                </button>
              ))}
            </div>
            {errors.roles_ids && <p className="text-(--error) text-xs mt-1">{errors.roles_ids}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-lg hover:bg-(--surface-container) transition text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={crear.isPending}
              className="flex-1 px-4 py-2 bg-(--primary) text-(--on-primary) rounded-lg hover:bg-(--primary)/90 transition text-sm font-medium disabled:opacity-50">
              {crear.isPending ? "Creando..." : "Crear Usuario"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}