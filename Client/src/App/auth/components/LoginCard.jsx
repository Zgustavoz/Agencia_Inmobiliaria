/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { Building2, Lock, User } from "lucide-react"
import { Link } from "react-router"

export const LoginCard = ({ form, serverError, onNavigate }) => {
  const MotionSection = motion.section

  return (
    <MotionSection
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md rounded-xl border border-(--outline-variant)/40 bg-(--surface-container-lowest) p-8 shadow-[0px_12px_32px_rgba(27,28,28,0.08)]"
    >
      <div className="mb-6 grid justify-items-center gap-3">
        <div className="rounded-lg bg-(--primary-fixed) p-2 text-(--primary)">
          <Building2 size={18} />
        </div>
        <span className="text-lg font-semibold text-(--primary)">Inmobiliaria Manager</span>
        <p className="text-center text-semi font-semibold text-(--on-surface-variant)">
          Iniciá sesión para guardar propiedades, hacer seguimiento y contactar agentes.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="username"
          children={(field) => (
            <field.TextField
              label="Usuario"
              type="text"
              placeholder="usuario"
              autoComplete="username"
              icon={User}
            />
          )}
        />


        <form.AppField name="password"
          children={(field) => (
            <field.TextField
              label="Contraseña"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              icon={Lock}
            />
          )
          }
        />
        <div className="pt-2">
          <form.AppForm>
            <form.BotonSubmitField className="w-full">
              Iniciar sesión
            </form.BotonSubmitField>
          </form.AppForm>
        </div>

        {serverError ? (
          <p className="text-sm font-medium text-red-500">{serverError}</p>
        ) : null}
      </form>

      <p className="mt-5 text-center text-sm text-(--on-surface-variant)">
        ¿No tienes cuenta?{" "}
        <Link
          to="/auth/register-client"
          onClick={onNavigate}
          className="font-semibold text-(--primary) hover:underline"
        >
          Regístrate como cliente
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-(--on-surface-variant)">
        ¿Eres agente?{" "}
        <Link
          to="/auth/register"
          onClick={onNavigate}
          className="font-semibold text-(--primary) hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </MotionSection>
  )
}
