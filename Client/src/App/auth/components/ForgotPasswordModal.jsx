import { motion } from "motion/react"
import { X, Mail, CheckCircle2 } from "lucide-react"
import { useAppForm } from "../../../shared/form"
import { useFormRecuperarPassword } from "../hook/useFormPassword"
import { useRecuperarPasswordMutation } from "../hook/usePasswordMutation"

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const { defaultValues, schema } = useFormRecuperarPassword()
  const recuperarMutation = useRecuperarPasswordMutation()

  const form = useAppForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await recuperarMutation.mutateAsync(value.email)
    },
  })

  const isSuccess = recuperarMutation.isSuccess
  const isError = recuperarMutation.isError

  if (!isOpen) return null

  const MotionDiv = motion.div

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 h-dvh">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <MotionDiv
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
          aria-label="Cerrar modal"
        >
          <X size={16} />
        </button>

        <div className="rounded-2xl bg-(--surface-container-lowest) p-8 shadow-2xl">
          {isSuccess && !isError ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--primary-fixed)">
                <CheckCircle2 size={24} className="text-(--primary)" />
              </div>
              <h2 className="text-2xl font-bold text-(--on-surface)">
                Email enviado
              </h2>
              <p className="text-(--on-surface-variant)">
                Revisa tu correo para encontrar el enlace de recuperación. El enlace expira en 24 horas.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full rounded-lg bg-(--primary) px-4 py-3 font-semibold text-(--on-primary) transition hover:opacity-90"
              >
                Entendido
              </button>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--primary-fixed)">
                  <Mail size={20} className="text-(--primary)" />
                </div>
                <h2 className="text-2xl font-bold text-(--on-surface)">
                  Recuperar contraseña
                </h2>
                <p className="text-sm text-(--on-surface-variant)">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                )}
              </form.AppField>

              {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  Ocurrió un error. Por favor, intenta de nuevo.
                </p>
              )}

              <form.AppForm>
                <form.BotonSubmitField
                  type="submit"
                  disabled={recuperarMutation.isPending}
                >
                  {recuperarMutation.isPending ? "Enviando..." : "Enviar enlace"}
                </form.BotonSubmitField>
              </form.AppForm>
            </form>
          )}
        </div>
      </MotionDiv>
    </div>
  )
}
