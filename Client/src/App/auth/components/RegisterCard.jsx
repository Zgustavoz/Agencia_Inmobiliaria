/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react"
import { Link } from "react-router"

export const RegisterCard = ({ form, serverError }) => {
  const Form = form
  const MotionSection = motion.section
  const MotionDiv = motion.div
  const role = form.state.values.role

  return (
    <MotionSection
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full rounded-xl border border-(--outline-variant)/30 bg-(--surface-container-lowest) shadow-[0px_12px_32px_rgba(27,28,28,0.08)]"
    >
      <div className="grid gap-0 lg:grid-cols-12">
        <aside className="border-b border-(--outline-variant)/20 bg-(--surface-container-low) p-7 lg:col-span-4 lg:border-r lg:border-b-0">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full bg-(--primary-fixed) px-3 py-1 text-[11px] font-bold tracking-wider text-(--on-primary-fixed)">
              Portal Profesional
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-(--on-surface)">
              Únete a la élite arquitectónica.
            </h1>
            <p className="text-sm leading-relaxed text-(--on-surface-variant)">
              Registra tu perfil profesional para operar propiedades, clientes y oportunidades con una experiencia premium.
            </p>
          </div>

          <div className="mt-7 space-y-4">
            <div className="flex gap-3">
              <div className="rounded-lg bg-(--surface-container-high) p-2 text-(--primary)">
                <Building2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--on-surface)">Portfolio Management</h3>
                <p className="text-xs text-(--on-surface-variant)">Listado inmobiliario y operación diaria.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg bg-(--surface-container-high) p-2 text-(--primary)">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--on-surface)">Validación de perfil</h3>
                <p className="text-xs text-(--on-surface-variant)">Alta segura y revisada antes de activación.</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="p-7 lg:col-span-8 lg:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-(--on-surface)">Registro de Profesional</h2>
              <p className="text-sm text-(--on-surface-variant)">Especifica tu rol (Agente o Administrador)</p>
            </div>

            <div className="inline-flex rounded-lg bg-(--surface-container-low) p-1">
              <button
                type="button"
                onClick={() => form.setFieldValue("role", "agent")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${role === "agent"
                  ? "bg-(--surface-container-lowest) text-(--primary) shadow-sm"
                  : "text-(--on-surface-variant)"
                  }`}
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => form.setFieldValue("role", "admin")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${role === "admin"
                  ? "bg-(--surface-container-lowest) text-(--primary) shadow-sm"
                  : "text-(--on-surface-variant)"
                  }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-(--primary)">
                <UserRound size={15} />
                USUARIOS TABLE DETAILS
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Form.AppField name="nombres">
                  {(FieldApi) => {
                    return <FieldApi.TextField label="Nombres" icon={User} placeholder="Elena" />
                  }}
                </Form.AppField>
                <Form.AppField name="apellidos">
                  {(FieldApi) => {
                    return <FieldApi.TextField label="Apellidos" icon={User} placeholder="Rodriguez" />
                  }}
                </Form.AppField>
                <Form.AppField name="email">
                  {(FieldApi) => {
                    return (
                      <FieldApi.TextField
                        label="Email"
                        type="email"
                        icon={Mail}
                        placeholder="elena.r@azureestate.com"
                      />
                    )
                  }}
                </Form.AppField>
                <Form.AppField name="telefono">
                  {(FieldApi) => {
                    return <FieldApi.TextField label="Teléfono" icon={Phone} placeholder="+34 000 000 000" />
                  }}
                </Form.AppField>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-(--primary)">
                <BadgeCheck size={15} />
                PERFIL Y CREDENCIALES
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.AppField name="username">
                  {(FieldApi) => {
                    return <FieldApi.TextField label="Usuario" placeholder="erodriguez_pro" />
                  }}
                </Form.AppField>
                <Form.AppField name="password">
                  {(FieldApi) => {
                    return (
                      <FieldApi.TextField
                        label="Contraseña"
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                      />
                    )
                  }}
                </Form.AppField>
                <Form.AppField name="confirmPassword">
                  {(FieldApi) => {
                    return (
                      <FieldApi.TextField
                        label="Confirmar Contraseña"
                        type="password"
                        autoComplete="new-password"
                        placeholder="********"
                      />
                    )
                  }}
                </Form.AppField>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-(--secondary)">
                <BriefcaseBusiness size={15} />
                DETALLES DEL PERFIL PROFESIONAL
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Form.AppField name="ci">
                  {(FieldApi) => {
                    const TextFieldComponent = FieldApi.TextField
                    return <TextFieldComponent label="CI" placeholder="99812" />
                  }}
                </Form.AppField>
                <Form.AppField name="direccion">
                  {(FieldApi) => {
                    return (
                      <FieldApi.GoogleAddressAutocompleteField
                        label="Dirección"
                        placeholder="cuarto anillo y av. banzer"
                        country="bo"
                      />
                    )
                  }}
                </Form.AppField>
                <Form.AppField name="ocupacion">
                  {(FieldApi) => {
                    return <FieldApi.TextField label="Ocupación" placeholder="Corredor Inmobiliario" />
                  }}
                </Form.AppField>
                <Form.AppField name="fechaNacimiento">
                  {(FieldApi) => {
                    return (
                      <FieldApi.TextField
                        label="Fecha de Nacimiento"
                        type="date"
                        placeholder="1990-01-01"
                      />
                    )
                  }}
                </Form.AppField>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="space-y-5 border-t border-(--outline-variant)/30 pt-6"
            >


              <Form.AppForm>
                <Form.BotonSubmitField type="submit" className="w-full py-4">
                  Crear Cuenta Profesional
                </Form.BotonSubmitField>
              </Form.AppForm>

              {serverError ? (
                <p className="text-sm font-medium text-red-500">
                  {typeof serverError === "string"
                    ? serverError
                    : serverError?.password?.[0]
                    ?? serverError?.email?.[0]
                    ?? serverError?.username?.[0]
                    ?? serverError?.detail
                    ?? "No se pudo registrar el usuario"}
                </p>
              ) : null}

              <p className="text-center text-sm text-(--on-surface-variant)">
                ¿Ya eres miembro?{" "}
                <Link to="/auth" className="font-semibold text-(--primary) hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </MotionDiv>
          </form>
        </div>
      </div>
    </MotionSection>
  )
}
