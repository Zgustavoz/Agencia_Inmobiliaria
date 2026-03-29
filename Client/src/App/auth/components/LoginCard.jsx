/* eslint-disable no-unused-vars */
import { motion } from "motion/react"
import { Building2, Lock, User } from "lucide-react"
import { Link } from "react-router"

export const LoginCard = ({ form, serverError }) => {
  const MotionSection = motion.section

  return (
    <MotionSection
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md rounded-xl border border-(--outline-variant)/40 bg-(--surface-container-lowest) p-8 shadow-[0px_12px_32px_rgba(27,28,28,0.08)]"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-(--primary-fixed) p-2 text-(--primary)">
          <Building2 size={18} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-(--on-surface)">Acceso Profesional</h1>
          <p className="text-sm text-(--on-surface-variant)">Ingresa a tu panel inmobiliario</p>
        </div>
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
            <form.BotonSubmitField type="submit">Iniciar sesión</form.BotonSubmitField>
          </form.AppForm>
        </div>

        {serverError ? (
          <p className="text-sm font-medium text-red-500">{serverError}</p>
        ) : null}
      </form>

      <p className="mt-5 text-center text-sm text-(--on-surface-variant)">
        ¿No tienes cuenta?{" "}
        <Link to="/auth/register-client" className="font-semibold text-(--primary) hover:underline">
          registrarse
        </Link>
      </p>
    </MotionSection>
  )
}
