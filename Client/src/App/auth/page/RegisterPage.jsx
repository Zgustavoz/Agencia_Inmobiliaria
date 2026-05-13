import { motion } from "motion/react"
import { useAppForm } from "../../../shared/form"
import { useFormRegister } from "../hook/useFormRegister"
import { RegisterCard } from "../components/RegisterCard"
import { useRegisterProfesionalMutation } from "../hook/useAuthMutation"

export const RegisterPage = () => {
  const registerMutation = useRegisterProfesionalMutation()
  const MotionDiv = motion.div
  const { defaultValues, schema } = useFormRegister("profesional")

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync({
        username: value.username,
        email: value.email,
        nombres: value.nombres,
        apellidos: value.apellidos,
        telefono: value.telefono,
        password: value.password,
        fotoUrl: value.fotoUrl,
        role: value.role,
      })
    },
  })

  return (
    <main className="relative overflow-hidden bg-(--surface) px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-(--primary)/12 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-(--secondary)/10 blur-3xl" />
      </div>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto max-w-6xl"
      >
        <RegisterCard form={form} serverError={registerMutation.error?.response?.data} />
      </MotionDiv>
    </main>
  )
}
