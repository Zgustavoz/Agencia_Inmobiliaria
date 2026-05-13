/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { BadgeCheck, Home, Mail, Phone, Search, Star, User, UserRound } from "lucide-react"
import { Link } from "react-router"

export const RegisterClienteCard = ({ form, serverError }) => {
  const Form        = form
  const MotionDiv   = motion.div
  const MotionSection = motion.section

  return (
    <MotionSection
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full rounded-xl border border-(--outline-variant)/30 bg-(--surface-container-lowest) shadow-[0px_12px_32px_rgba(27,28,28,0.08)]"
    >
      <div className="grid gap-0 lg:grid-cols-12">

        {/* Sidebar izquierdo */}
        <aside className="border-b border-(--outline-variant)/20 bg-(--surface-container-low) p-7 lg:col-span-4 lg:border-r lg:border-b-0">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full bg-(--primary-fixed) px-3 py-1 text-[11px] font-bold tracking-wider text-(--on-primary-fixed)">
              Acceso Gratuito
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-(--on-surface)">
              Encuentra tu hogar ideal.
            </h1>
            <p className="text-sm leading-relaxed text-(--on-surface-variant)">
              Crea tu cuenta como cliente y accede a cientos de propiedades en venta, alquiler y anticrético.
            </p>
          </div>

          <div className="mt-7 space-y-4">
            <div className="flex gap-3">
              <div className="rounded-lg bg-(--surface-container-high) p-2 text-(--primary)">
                <Search size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--on-surface)">Búsqueda inteligente</h3>
                <p className="text-xs text-(--on-surface-variant)">Encuentra propiedades con lenguaje natural.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg bg-(--surface-container-high) p-2 text-(--primary)">
                <Star size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--on-surface)">Recomendaciones personalizadas</h3>
                <p className="text-xs text-(--on-surface-variant)">Propiedades según tus preferencias.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg bg-(--surface-container-high) p-2 text-(--primary)">
                <Home size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--on-surface)">Agenda visitas</h3>
                <p className="text-xs text-(--on-surface-variant)">Coordina citas con agentes fácilmente.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Formulario derecho */}
        <div className="p-7 lg:col-span-8 lg:p-10">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-(--on-surface)">Crear cuenta</h2>
            <p className="text-sm text-(--on-surface-variant)">Completa tus datos para empezar</p>
          </div>

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            {/* Datos personales */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-(--primary)">
                <UserRound size={15} />
                DATOS PERSONALES
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.AppField name="nombres">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Nombres" icon={User} placeholder="Juan" />
                  )}
                </Form.AppField>
                <Form.AppField name="apellidos">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Apellidos" icon={User} placeholder="Pérez" />
                  )}
                </Form.AppField>
                <Form.AppField name="email">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Email" type="email" icon={Mail} placeholder="juan@gmail.com" />
                  )}
                </Form.AppField>
                <Form.AppField name="telefono">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Teléfono" icon={Phone} placeholder="+591 70000000" />
                  )}
                </Form.AppField>
              </div>
            </MotionDiv>

            {/* Credenciales */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-(--primary)">
                <BadgeCheck size={15} />
                CREDENCIALES
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.AppField name="username">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Usuario" placeholder="juanperez123" />
                  )}
                </Form.AppField>
                <Form.AppField name="password">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Contraseña" type="password" placeholder="********" autoComplete="new-password" />
                  )}
                </Form.AppField>
                <Form.AppField name="confirmPassword">
                  {(FieldApi) => (
                    <FieldApi.TextField label="Confirmar contraseña" type="password" placeholder="********" autoComplete="new-password" />
                  )}
                </Form.AppField>
              </div>
            </MotionDiv>

            {/* Submit */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.3 }}
              className="space-y-5 border-t border-(--outline-variant)/30 pt-6"
            >
              <Form.AppForm>
                <Form.BotonSubmitField type="submit" className="w-full py-4">
                  Crear cuenta
                </Form.BotonSubmitField>
              </Form.AppForm>

              {serverError && (
                <p className="text-sm font-medium text-red-500">
                  {typeof serverError === "string"
                    ? serverError
                    : serverError?.password?.[0]
                    ?? serverError?.email?.[0]
                    ?? serverError?.username?.[0]
                    ?? serverError?.detail
                    ?? "No se pudo registrar el usuario"}
                </p>
              )}

              <p className="text-center text-sm text-(--on-surface-variant)">
                ¿Ya tienes cuenta?{" "}
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