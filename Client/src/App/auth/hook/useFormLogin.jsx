import z from "zod";
export const useFormLogin = () => {

  const defaultValueLogin = {
    defaultValues: {
      username: '',
      password: ''
    }
  }

  const loginSquema = z.object({
    username: z.string().trim().min(3, "Usuario requerido"),
    password: z.string().trim().refine((value) => !!value, "requerido")
  })

  return {
    defaultValueLogin,
    loginSquema
  }
}
