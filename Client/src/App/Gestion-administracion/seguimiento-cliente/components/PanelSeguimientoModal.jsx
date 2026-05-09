import { useState } from "react"
import { X, Phone, Mail, MessageCircle, Plus, Calendar, Target, Bell, RefreshCw } from "lucide-react"
import { useClienteDetalle } from "../hooks/useCliente"

const ETAPA_COLORES = {
  prospecto:   "bg-(--surface-container) text-(--on-surface-variant)",
  interesado:  "bg-(--primary-fixed) text-(--on-primary-fixed)",
  negociacion: "bg-(--secondary-fixed) text-(--on-secondary-fixed)",
  cerrado:     "bg-(--tertiary-container) text-(--on-tertiary-container)",
  perdido:     "bg-(--error-container) text-(--on-error-container)",
}

const TIPO_INTERACCION_COLORES = {
  consulta: "bg-(--primary-fixed) text-(--on-primary-fixed)",
  visita:   "bg-(--tertiary-container) text-(--on-tertiary-container)",
  llamada:  "bg-(--secondary-fixed) text-(--on-secondary-fixed)",
  mensaje:  "bg-(--surface-container-high) text-(--on-surface-variant)",
  email:    "bg-(--surface-container) text-(--on-surface-variant)",
  whatsapp: "bg-(--tertiary-container) text-(--on-tertiary-container)",
}

// ── Formulario interacción ────────────────────────────────────
const FormInteraccion = ({ onSubmit, isPending, onCancel }) => {
  const [form, setForm] = useState({ tipo: "consulta", asunto: "", detalle: "", proxima_accion: "" })
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="space-y-3 p-4 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handle}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)">
            {["consulta","visita","llamada","mensaje","email","whatsapp"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Asunto</label>
          <input name="asunto" value={form.asunto} onChange={handle} placeholder="Asunto..."
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Detalle</label>
        <textarea name="detalle" value={form.detalle} onChange={handle} rows={2} placeholder="Descripción..."
          className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Próxima acción</label>
        <input name="proxima_accion" value={form.proxima_accion} onChange={handle} placeholder="Ej: Llamar mañana"
          className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-lg text-xs hover:bg-(--surface-container) transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={() => onSubmit(form)}
          className="flex-1 px-3 py-2 bg-(--primary) text-(--on-primary) rounded-lg text-xs hover:bg-(--primary)/90 transition disabled:opacity-50">
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  )
}

// ── Formulario oportunidad ────────────────────────────────────
const FormOportunidad = ({ onSubmit, isPending, onCancel }) => {
  const [form, setForm] = useState({ nombre: "", etapa: "prospecto", valor_estimado: "", probabilidad: "", descripcion: "" })
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="space-y-3 p-4 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handle} placeholder="Ej: Compra departamento"
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
        </div>
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Etapa</label>
          <select name="etapa" value={form.etapa} onChange={handle}
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)">
            {["prospecto","interesado","negociacion","cerrado","perdido"].map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Valor estimado</label>
          <input type="number" name="valor_estimado" value={form.valor_estimado} onChange={handle} placeholder="0.00"
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
        </div>
        <div>
          <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Probabilidad %</label>
          <input type="number" name="probabilidad" value={form.probabilidad} onChange={handle} placeholder="0-100"
            className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-lg text-xs hover:bg-(--surface-container) transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={() => onSubmit(form)}
          className="flex-1 px-3 py-2 bg-(--primary) text-(--on-primary) rounded-lg text-xs hover:bg-(--primary)/90 transition disabled:opacity-50">
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  )
}

// ── Formulario recordatorio ───────────────────────────────────
const FormRecordatorio = ({ onSubmit, isPending, onCancel }) => {
  const [form, setForm] = useState({ titulo: "", descripcion: "", fecha_recordatorio: "" })
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="space-y-3 p-4 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
      <div>
        <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Título</label>
        <input name="titulo" value={form.titulo} onChange={handle} placeholder="Ej: Llamar al cliente"
          className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
      </div>
      <div>
        <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Fecha y hora</label>
        <input type="datetime-local" name="fecha_recordatorio" value={form.fecha_recordatorio} onChange={handle}
          className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary)" />
      </div>
      <div>
        <label className="block text-xs font-medium text-(--on-surface-variant) mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handle} rows={2}
          className="w-full px-3 py-2 border border-(--outline-variant)/40 rounded-lg text-sm bg-(--surface) text-(--on-surface) focus:outline-none focus:ring-2 focus:ring-(--primary) resize-none" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-3 py-2 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-lg text-xs hover:bg-(--surface-container) transition">
          Cancelar
        </button>
        <button type="button" disabled={isPending} onClick={() => onSubmit(form)}
          className="flex-1 px-3 py-2 bg-(--primary) text-(--on-primary) rounded-lg text-xs hover:bg-(--primary)/90 transition disabled:opacity-50">
          {isPending ? "Guardando..." : "Guardar"}
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
      <div className="bg-(--surface-container-lowest) rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--outline-variant)/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-(--primary-fixed) rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-(--on-primary-fixed)">
                {cliente.nombres?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-(--on-surface)">
                {cliente.nombres} {cliente.apellidos}
              </h2>
              <p className="text-sm text-(--on-surface-variant)">{cliente.codigo_cliente}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-(--surface-container) rounded-lg transition">
            <X size={20} className="text-(--on-surface-variant)" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar izquierdo — info + stats */}
          <div className="w-64 border-r border-(--outline-variant)/20 p-4 space-y-4 overflow-y-auto shrink-0">

            {/* Contacto */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">Contacto</p>
              {cliente.email && (
                <div className="flex items-center gap-2 text-xs text-(--on-surface-variant)">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cliente.email}</span>
                </div>
              )}
              {cliente.telefono && (
                <div className="flex items-center gap-2 text-xs text-(--on-surface-variant)">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {cliente.telefono}
                </div>
              )}
              {cliente.whatsapp && (
                <div className="flex items-center gap-2 text-xs text-(--on-surface-variant)">
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  {cliente.whatsapp}
                </div>
              )}
            </div>

            {/* Stats */}
            {data && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">Resumen</p>
                {[
                  { label: "Interacciones",       value: data.stats.total_interacciones },
                  { label: "Oportunidades",        value: data.stats.total_oportunidades },
                  { label: "Oport. abiertas",      value: data.stats.oportunidades_abiertas },
                  { label: "Recordatorios pend.",  value: data.stats.recordatorios_pendientes },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-xs text-(--on-surface-variant)">{s.label}</span>
                    <span className="text-sm font-semibold text-(--on-surface)">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Última interacción */}
            {data?.ultima_interaccion && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-(--on-surface-variant) uppercase tracking-wider">Última interacción</p>
                <div className="p-2 bg-(--surface-container-low) rounded-lg">
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${TIPO_INTERACCION_COLORES[data.ultima_interaccion.tipo] || ""}`}>
                    {data.ultima_interaccion.tipo}
                  </span>
                  <p className="text-xs text-(--on-surface-variant) mt-1 truncate">
                    {data.ultima_interaccion.asunto || "Sin asunto"}
                  </p>
                  <p className="text-xs text-(--on-surface-variant) opacity-60 mt-0.5">
                    {new Date(data.ultima_interaccion.creado_en).toLocaleDateString("es-BO")}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-(--outline-variant)/20 px-4 shrink-0">
              {[
                { key: "interacciones", label: "Interacciones", icon: RefreshCw },
                { key: "oportunidades", label: "Oportunidades",  icon: Target },
                { key: "recordatorios", label: "Recordatorios",  icon: Bell },
              ].map(t => (
                <button
                  key={t.key} type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition ${
                    tab === t.key
                      ? "border-(--primary) text-(--primary)"
                      : "border-transparent text-(--on-surface-variant) hover:text-(--on-surface)"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Contenido tab */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {resumen.isLoading ? (
                <div className="text-center py-8 text-(--on-surface-variant) text-sm">Cargando...</div>
              ) : (

                /* ── Interacciones ── */
                tab === "interacciones" && (
                  <>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setShowFormInterac(!showFormInterac)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-(--on-primary) rounded-lg text-xs font-medium hover:bg-(--primary)/90 transition">
                        <Plus size={13} />
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
                    {data?.cliente && (
                      <div className="space-y-2">
                        {resumen.data?.ultima_interaccion ? (
                          [resumen.data.ultima_interaccion].map(i => (
                            <div key={i.id} className="p-3 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${TIPO_INTERACCION_COLORES[i.tipo] || ""}`}>
                                  {i.tipo}
                                </span>
                                <span className="text-xs text-(--on-surface-variant)">
                                  {new Date(i.creado_en).toLocaleDateString("es-BO")}
                                </span>
                              </div>
                              {i.asunto && <p className="text-sm font-medium text-(--on-surface)">{i.asunto}</p>}
                              {i.detalle && <p className="text-xs text-(--on-surface-variant) mt-1">{i.detalle}</p>}
                              {i.proxima_accion && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-(--primary)">
                                  <Calendar className="w-3 h-3" />
                                  {i.proxima_accion}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-sm text-(--on-surface-variant) py-8">Sin interacciones registradas</p>
                        )}
                      </div>
                    )}
                  </>
                )
              )}

              {/* ── Oportunidades ── */}
              {tab === "oportunidades" && !resumen.isLoading && (
                <>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setShowFormOport(!showFormOport)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-(--on-primary) rounded-lg text-xs font-medium hover:bg-(--primary)/90 transition">
                      <Plus size={13} />
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
                  <div className="space-y-2">
                    {data?.oportunidades_activas?.length ? (
                      data.oportunidades_activas.map(o => (
                        <div key={o.id} className="p-3 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-(--on-surface)">{o.nombre}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${ETAPA_COLORES[o.etapa] || ""}`}>
                              {o.etapa}
                            </span>
                          </div>
                          {o.valor_estimado && (
                            <p className="text-xs text-(--on-surface-variant)">
                              Valor: Bs. {Number(o.valor_estimado).toLocaleString("es-BO")}
                            </p>
                          )}
                          {o.probabilidad && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-(--on-surface-variant) mb-0.5">
                                <span>Probabilidad</span>
                                <span>{o.probabilidad}%</span>
                              </div>
                              <div className="h-1.5 bg-(--surface-container-high) rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-(--primary) rounded-full"
                                  style={{ width: `${o.probabilidad}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-(--on-surface-variant) py-8">Sin oportunidades activas</p>
                    )}
                  </div>
                </>
              )}

              {/* ── Recordatorios ── */}
              {tab === "recordatorios" && !resumen.isLoading && (
                <>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setShowFormRecord(!showFormRecord)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-(--primary) text-(--on-primary) rounded-lg text-xs font-medium hover:bg-(--primary)/90 transition">
                      <Plus size={13} />
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
                  <div className="space-y-2">
                    {data?.recordatorios_pendientes?.length ? (
                      data.recordatorios_pendientes.map(r => (
                        <div key={r.id} className="p-3 bg-(--surface-container-low) rounded-xl border border-(--outline-variant)/20">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-(--on-surface)">{r.titulo}</p>
                            <div className="flex items-center gap-1 text-xs text-(--on-surface-variant)">
                              <Calendar className="w-3 h-3" />
                              {new Date(r.fecha_recordatorio).toLocaleDateString("es-BO")}
                            </div>
                          </div>
                          {r.descripcion && (
                            <p className="text-xs text-(--on-surface-variant) mt-1">{r.descripcion}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-(--on-surface-variant) py-8">Sin recordatorios pendientes</p>
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