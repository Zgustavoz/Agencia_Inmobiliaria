import { motion } from "motion/react"
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { useParams, useNavigate } from "react-router"
import { useAppForm } from "../../../shared/form"
import { useFormRestablecerPassword } from "../hook/useFormPassword"
import { useRestablecerPasswordMutation } from "../hook/usePasswordMutation"

export const ResetPasswordPage = () => {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const { defaultValues, schema } = useFormRestablecerPassword()
  const restablecerMutation = useRestablecerPasswordMutation()

  const form = useAppForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await restablecerMutation.mutateAsync({
        uidb64: uid,
        token: token,
        new_password: value.new_password,
      })
    },
  })

  const isSuccess = restablecerMutation.isSuccess
  const isError = restablecerMutation.isError
  const errorMessage = restablecerMutation.error?.response?.data?.error

  const MotionDiv = motion.div
  const MotionMain = motion.main

  return (
    <MotionMain
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 bg-(--surface)"
    >
      <MotionDiv
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-md"
      >
        {isSuccess ? (
          <div className="space-y-6 rounded-2xl border border-(--outline-variant)/30 bg-(--surface-container-lowest) p-8 shadow-lg">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--primary-fixed)">
                <CheckCircle2 size={32} className="text-(--primary)" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-(--on-surface)">
                Contraseña restablecida
              </h1>
              <p className="text-(--on-surface-variant)">
                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="w-full rounded-lg bg-(--primary) px-4 py-3 font-semibold text-(--on-primary) transition hover:opacity-90"
            >
              Volver al login
            </button>
          </div>
        ) : (
          <div className="space-y-6 rounded-2xl border border-(--outline-variant)/30 bg-(--surface-container-lowest) p-8 shadow-lg">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary-fixed)">
                <Lock size={24} className="text-(--primary)" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-(--on-surface)">
                Restablecer contraseña
              </h1>
              <p className="text-sm text-(--on-surface-variant)">
                Ingresa tu nueva contraseña abajo.
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
              <form.AppField name="new_password">
                {(field) => (
                  <field.TextField
                    label="Nueva contraseña"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              </form.AppField>

              <form.AppField name="confirmPassword">
                {(field) => (
                  <field.TextField
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              </form.AppField>

              {isError && errorMessage && (
                <div className="flex gap-3 rounded-lg bg-red-50 px-4 py-3">
                  <AlertCircle size={18} className="shrink-0 text-red-600" />
                  <p className="text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <form.AppForm>
                  <form.BotonSubmitField
                    type="submit"
                    disabled={restablecerMutation.isPending}
                  >
                    {restablecerMutation.isPending ? "Guardando..." : "Guardar contraseña"}
                  </form.BotonSubmitField>
                </form.AppForm>
              </div>
            </form>
          </div>
        )}
      </MotionDiv>
    </MotionMain>
  )
}
