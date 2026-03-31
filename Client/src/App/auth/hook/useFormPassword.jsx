import z from "zod"

const recuperarPasswordSchema = z.object({
  email: z.string().email("El correo no es válido").trim(),
})

const restablecerPasswordSchema = z.object({
  new_password: z.string().trim().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string().trim().min(8, "Mínimo 8 caracteres"),
}).refine(data => data.new_password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const useFormRecuperarPassword = () => {
  return {
    defaultValues: { email: "" },
    schema: recuperarPasswordSchema,
  }
}

export const useFormRestablecerPassword = () => {
  return {
    defaultValues: { new_password: "", confirmPassword: "" },
    schema: restablecerPasswordSchema,
  }
}
