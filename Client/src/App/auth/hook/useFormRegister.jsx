import z from "zod"

export const useFormRegister = () => {
  const defaultValueRegister = {
    defaultValues: {
      role: "agent",
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      username: "",
      password: "",
      confirmPassword: "",
      ci: "",
      direccion: "",
      ocupacion: "",
      fechaNacimiento: "",
    },
  }

  const registerSchema = z.object({
    role: z.enum(["agent", "admin"]),
    nombres: z.string().trim().min(2, "Mínimo 2 caracteres"),
    apellidos: z.string().trim().min(2, "Mínimo 2 caracteres"),
    email: z.email("El correo electrónico no es válido").trim(),
    telefono: z.string().trim().min(8, "Teléfono inválido"),
    username: z.string().trim().min(4, "Mínimo 4 caracteres"),
    password: z.string().trim().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().trim().min(8, "Mínimo 8 caracteres"),
    ci: z.string().trim().min(4, "Requerido"),
    direccion: z.string().trim().min(8, "Selecciona una dirección válida"),
    ocupacion: z.string().trim().min(3, "Requerido"),
    fechaNacimiento: z.string().trim().min(1, "Requerido")
  })

  return {
    defaultValueRegister,
    registerSchema,
  }
}
