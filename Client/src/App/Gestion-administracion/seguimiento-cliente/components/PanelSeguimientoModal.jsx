import { useState } from "react"
import { X, Phone, Mail, MessageCircle, Plus, Calendar, Target, Bell, RefreshCw, UserCheck, AlertCircle, Clock, DollarSign, TrendingUp, CheckCircle, User } from "lucide-react"
import { useClienteDetalle } from "../hooks/useCliente"
import { useUsuario } from "../../gestion-usuario/hooks/useUsuario"
import { asignarAgente } from "../api/clienteApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const ETAPA_COLORES = {
  prospecto:   "bg-blue-100 text-blue-700",
  interesado:  "bg-green-100 text-green-700",
  negociacion: "bg-yellow-100 text-yellow-700",
  cerrado:     "bg-purple-100 text-purple-700",
  perdido:     "bg-red-100 text-red-700",
}

const TIPO_INTERACCION_COLORES = {
  consulta: "bg-blue-100 text-blue-700",
  visita:   "bg-purple-100 text-purple-700",
  llamada:  "bg-green-100 text-green-700",
  mensaje:  "bg-gray-100 text-gray-700",
  email:    "bg-indigo-100 text-indigo-700",
  whatsapp: "bg-teal-100 text-teal-700",
}

// ── Formulario interacción ────────────────────────────────────
const FormInteraccion = ({ onSubmit, isPending, onCancel }) => {
  const [form,   setForm]   = useState({ tipo: "consulta", asunto: "", detalle: "", proxima_accion: "" })
  const [errors, setErrors] = useState({})

  const handle = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const validar = () => {
    const errs = {}
    if (!form.asunto.trim()) errs.asunto = "El asunto es requerido"
    if (!form.detalle.trim()) errs.detalle = "El detalle es requerido"
    return errs
  }

  const handleSubmit = () => {
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
  }

  const inputClass = (name) =>
    `w-full px-3 py-2 rounded-lg text-sm bg-white border focus:outline-none focus:ring-2 transition-all ${
      errors[name] 
        ? "border-red-500 focus:ring-red-500" 
        : "border-gray-300 focus:ring-blue-500"
    }`

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
        <h3 className="text-sm font-semibold text-gray-700">Nueva Interacción</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handle} className={inputClass("tipo")}>
            {["consulta","visita","llamada","mensaje","email","whatsapp"].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Asunto</label>
          <input name="asunto" value={form.asunto} onChange={handle}
            placeholder="Ej: Consulta sobre propiedad..." className={inputClass("asunto")} />
          {errors.asunto && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.asunto}</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Detalle</label>
        <textarea name="detalle" value={form.detalle} onChange={handle} rows={2}
          placeholder="Descripción detallada de la interacción..." className={`${inputClass("detalle")} resize-none`} />
        {errors.detalle && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.detalle}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Próxima acción (opcional)</label>
        <input name="proxima_accion" value={form.proxima_accion} onChange={handle}
          placeholder="Ej: Llamar mañana a las 10am" className={inputClass("proxima_accion")} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={handleSubmit}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </span>
          ) : "Guardar"}
        </button>
      </div>
    </div>
  )
}

// ── Formulario oportunidad ────────────────────────────────────
const FormOportunidad = ({ onSubmit, isPending, onCancel }) => {
  const [form,   setForm]   = useState({ nombre: "", etapa: "prospecto", valor_estimado: "", probabilidad: "", descripcion: "" })
  const [errors, setErrors] = useState({})

  const handle = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const validar = () => {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = "El nombre de la oportunidad es requerido"
    if (form.valor_estimado && form.valor_estimado < 0) errs.valor_estimado = "El valor estimado no puede ser negativo"
    if (form.probabilidad && (form.probabilidad < 0 || form.probabilidad > 100))
      errs.probabilidad = "La probabilidad debe estar entre 0 y 100"
    return errs
  }

  const handleSubmit = () => {
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
  }

  const inputClass = (name) =>
    `w-full px-3 py-2 rounded-lg text-sm bg-white border focus:outline-none focus:ring-2 transition-all ${
      errors[name] 
        ? "border-red-500 focus:ring-red-500" 
        : "border-gray-300 focus:ring-green-500"
    }`

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
        <h3 className="text-sm font-semibold text-gray-700">Nueva Oportunidad</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handle}
            placeholder="Ej: Compra departamento" className={inputClass("nombre")} />
          {errors.nombre && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.nombre}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Etapa</label>
          <select name="etapa" value={form.etapa} onChange={handle} className={inputClass("etapa")}>
            {["prospecto","interesado","negociacion","cerrado","perdido"].map(e => (
              <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Valor estimado (Bs.)</label>
          <input type="number" name="valor_estimado" value={form.valor_estimado}
            onChange={handle} placeholder="0.00" className={inputClass("valor_estimado")} />
          {errors.valor_estimado && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.valor_estimado}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Probabilidad (%)</label>
          <input type="number" name="probabilidad" value={form.probabilidad}
            onChange={handle} placeholder="0-100" min="0" max="100" className={inputClass("probabilidad")} />
          {errors.probabilidad && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.probabilidad}</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Descripción (opcional)</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handle} rows={2}
          placeholder="Detalles adicionales de la oportunidad..." className={`${inputClass("descripcion")} resize-none`} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={handleSubmit}
          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </span>
          ) : "Guardar"}
        </button>
      </div>
    </div>
  )
}

// ── Formulario recordatorio ───────────────────────────────────
const FormRecordatorio = ({ onSubmit, isPending, onCancel }) => {
  const [form,   setForm]   = useState({ titulo: "", descripcion: "", fecha_recordatorio: "" })
  const [errors, setErrors] = useState({})

  const handle = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }))
  }

  const validar = () => {
    const errs = {}
    if (!form.titulo.trim())            errs.titulo = "El título es requerido"
    if (!form.fecha_recordatorio.trim()) errs.fecha_recordatorio = "La fecha y hora son requeridas"
    if (form.fecha_recordatorio && new Date(form.fecha_recordatorio) < new Date()) 
      errs.fecha_recordatorio = "La fecha y hora no pueden ser en el pasado"
    return errs
  }

  const handleSubmit = () => {
    const errs = validar()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
  }

  const inputClass = (name) =>
    `w-full px-3 py-2 rounded-lg text-sm bg-white border focus:outline-none focus:ring-2 transition-all ${
      errors[name] 
        ? "border-red-500 focus:ring-red-500" 
        : "border-gray-300 focus:ring-yellow-500"
    }`

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
        <h3 className="text-sm font-semibold text-gray-700">Nuevo Recordatorio</h3>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
        <input name="titulo" value={form.titulo} onChange={handle}
          placeholder="Ej: Llamar al cliente" className={inputClass("titulo")} />
        {errors.titulo && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.titulo}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Fecha y hora *</label>
        <input type="datetime-local" name="fecha_recordatorio" value={form.fecha_recordatorio}
          onChange={handle} className={inputClass("fecha_recordatorio")} />
        {errors.fecha_recordatorio && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.fecha_recordatorio}</span>
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Descripción (opcional)</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handle} rows={2}
          placeholder="Detalles adicionales del recordatorio..." className={`${inputClass("descripcion")} resize-none`} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={handleSubmit}
          className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </span>
          ) : "Guardar"}
        </button>
      </div>
    </div>
  )
}

// ── Panel principal ───────────────────────────────────────────
export const PanelSeguimientoModal = ({ cliente, onClose }) => {
  const { resumen, agregarInteraccion, agregarOportunidad, agregarRecordatorio } = useClienteDetalle(cliente.id)
  const [tab,               setTab]               = useState("interacciones")
  const [showFormInterac,   setShowFormInterac]    = useState(false)
  const [showFormOport,     setShowFormOport]      = useState(false)
  const [showFormRecord,    setShowFormRecord]     = useState(false)

  const data = resumen.data
  const queryClient  = useQueryClient()
  const { usuarios } = useUsuario()

  const asignar = useMutation({
    mutationFn: ({ agente_id }) => asignarAgente({ clienteId: cliente.id, agente_id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cliente-resumen", cliente.id])
      queryClient.invalidateQueries(["clientes"])
    },
  })

  const handleInteraccion = (payload) => {
    agregarInteraccion.mutate({ payload }, { onSuccess: () => setShowFormInterac(false) })
  }

  const handleOportunidad = (payload) => {
    agregarOportunidad.mutate({ payload }, { onSuccess: () => setShowFormOport(false) })
  }

  const handleRecordatorio = (payload) => {
    agregarRecordatorio.mutate({ payload }, { onSuccess: () => setShowFormRecord(false) })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header - Cambiado a azul consistente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {cliente.nombres} {cliente.apellidos}
                </h2>
                <p className="text-xs text-blue-100">{cliente.codigo_cliente}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar izquierdo — info + stats */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 p-5 space-y-4 overflow-y-auto shrink-0">
            
            {/* Contacto */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contacto</h3>
              <div className="space-y-2">
                {cliente.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{cliente.email}</span>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{cliente.telefono}</span>
                  </div>
                )}
                {cliente.whatsapp && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span>{cliente.whatsapp}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            {data && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumen</h3>
                <div className="space-y-2">
                  {[
                    { icon: <RefreshCw className="w-4 h-4 text-blue-500" />, label: "Interacciones", value: data.stats.total_interacciones },
                    { icon: <Target className="w-4 h-4 text-green-500" />, label: "Oportunidades", value: data.stats.total_oportunidades },
                    { icon: <TrendingUp className="w-4 h-4 text-purple-500" />, label: "Oport. abiertas", value: data.stats.oportunidades_abiertas },
                    { icon: <Clock className="w-4 h-4 text-yellow-500" />, label: "Recordatorios pend.", value: data.stats.recordatorios_pendientes },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {s.icon}
                        <span className="text-gray-600">{s.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Última interacción */}
            {data?.ultima_interaccion && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Última interacción</h3>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-lg font-medium ${TIPO_INTERACCION_COLORES[data.ultima_interaccion.tipo] || "bg-gray-100 text-gray-700"}`}>
                    {data.ultima_interaccion.tipo}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mt-2">
                    {data.ultima_interaccion.asunto || "Sin asunto"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(data.ultima_interaccion.creado_en).toLocaleDateString("es-BO")}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Tabs - Mejorados con barrita azul */}
            <div className="flex border-b border-gray-200 bg-white shrink-0">
              {[
                { key: "interacciones", label: "Interacciones", icon: RefreshCw },
                { key: "oportunidades", label: "Oportunidades", icon: Target },
                { key: "recordatorios", label: "Recordatorios", icon: Bell },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                    tab === t.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {tab === t.key && data && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {t.key === "interacciones" ? data.stats.total_interacciones :
                       t.key === "oportunidades" ? data.stats.total_oportunidades :
                       data.stats.recordatorios_pendientes}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Contenido tab */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {resumen.isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500 text-sm">Cargando...</p>
                </div>
              ) : (

                /* ── Interacciones ── */
                tab === "interacciones" && (
                  <>
                    <div className="flex justify-end">
                      <button onClick={() => setShowFormInterac(!showFormInterac)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition">
                        <Plus size={14} />
                        Nueva interacción
                      </button>
                    </div>
                    {showFormInterac && (
                      <FormInteraccion
                        onSubmit={handleInteraccion}
                        isPending={agregarInteraccion.isPending}
                        onCancel={() => setShowFormInterac(false)}
                      />
                    )}
                    {data?.ultima_interaccion ? (
                      <div className="space-y-3">
                        {[data.ultima_interaccion].map(i => (
                          <div key={i.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <span className={`px-2 py-1 text-xs rounded-lg font-medium ${TIPO_INTERACCION_COLORES[i.tipo] || "bg-gray-100 text-gray-700"}`}>
                                {i.tipo}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(i.creado_en).toLocaleDateString("es-BO")}
                              </span>
                            </div>
                            {i.asunto && <p className="text-sm font-medium text-gray-800">{i.asunto}</p>}
                            {i.detalle && <p className="text-xs text-gray-600 mt-1">{i.detalle}</p>}
                            {i.proxima_accion && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                                <Calendar className="w-3 h-3" />
                                {i.proxima_accion}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        Sin interacciones registradas
                      </div>
                    )}
                  </>
                )
              )}

              {/* ── Oportunidades ── */}
              {tab === "oportunidades" && !resumen.isLoading && (
                <>
                  <div className="flex justify-end">
                    <button onClick={() => setShowFormOport(!showFormOport)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition">
                      <Plus size={14} />
                      Nueva oportunidad
                    </button>
                  </div>
                  {showFormOport && (
                    <FormOportunidad
                      onSubmit={handleOportunidad}
                      isPending={agregarOportunidad.isPending}
                      onCancel={() => setShowFormOport(false)}
                    />
                  )}
                  <div className="space-y-3">
                    {data?.oportunidades_activas?.length ? (
                      data.oportunidades_activas.map(o => (
                        <div key={o.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-800">{o.nombre}</h4>
                            <span className={`px-2 py-1 text-xs rounded-lg font-medium ${ETAPA_COLORES[o.etapa] || "bg-gray-100 text-gray-700"}`}>
                              {o.etapa}
                            </span>
                          </div>
                          {o.valor_estimado && (
                            <p className="text-xs text-gray-600">
                              Valor: Bs. {Number(o.valor_estimado).toLocaleString("es-BO")}
                            </p>
                          )}
                          {o.probabilidad && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Probabilidad</span>
                                <span>{o.probabilidad}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${o.probabilidad}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        Sin oportunidades activas
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Recordatorios ── */}
              {tab === "recordatorios" && !resumen.isLoading && (
                <>
                  <div className="flex justify-end">
                    <button onClick={() => setShowFormRecord(!showFormRecord)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-medium transition">
                      <Plus size={14} />
                      Nuevo recordatorio
                    </button>
                  </div>
                  {showFormRecord && (
                    <FormRecordatorio
                      onSubmit={handleRecordatorio}
                      isPending={agregarRecordatorio.isPending}
                      onCancel={() => setShowFormRecord(false)}
                    />
                  )}
                  <div className="space-y-3">
                    {data?.recordatorios_pendientes?.length ? (
                      data.recordatorios_pendientes.map(r => (
                        <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-gray-800">{r.titulo}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(r.fecha_recordatorio).toLocaleDateString("es-BO")}
                            </div>
                          </div>
                          {r.descripcion && (
                            <p className="text-xs text-gray-600 mt-1">{r.descripcion}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-sm">
                        Sin recordatorios pendientes
                      </div>
                    )}
                  </div>
                  
                  {/* Asignar Agente */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Asignar agente</h3>
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) asignar.mutate({ agente_id: e.target.value })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar agente...</option>
                      {(usuarios.data?.results || [])
                        .filter(u => !u.es_admin)
                        .map(u => (
                          <option key={u.id} value={u.id}>
                            {u.nombres} {u.apellidos}
                          </option>
                        ))
                      }
                    </select>
                    {cliente.agente_principal && (
                      <p className="text-xs text-gray-500 mt-2">
                        Actual: <span className="font-medium text-gray-700">{cliente.agente_principal}</span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}