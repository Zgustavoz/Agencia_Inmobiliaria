import { useAppForm } from "../../../shared/form"
import { LoginCard } from "../components/LoginCard"
import { useFormLogin } from "../hook/useFormLogin"
import { useLoginMutation } from "../hook/useAuthMutation"


export const LoginPage = () => {
  const loginMutation = useLoginMutation()

  const { defaultValueLogin, loginSquema } = useFormLogin()

  const form = useAppForm({
    defaultValues: defaultValueLogin.defaultValues,
    validators: {
      onChange: loginSquema
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync({
        username: value.username,
        password: value.password,
      })
    }
  })

  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-(--surface) px-6 py-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-sky-500/20 via-transparent to-blue-500/10" />
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100dvh-8rem)] items-center justify-center py-6">
        <LoginCard form={form} serverError={loginMutation.error?.response?.data?.detail} />
      </div>
    </main>
  )
}
