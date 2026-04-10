import z from "zod"

const baseSchema = z.object({
  nombres: z.string().trim().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().trim().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("El correo no es válido").trim(),
  telefono: z.string().trim().min(8, "Teléfono inválido"),
  username: z.string().trim().min(4, "Mínimo 4 caracteres"),
  password: z.string().trim().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string().trim().min(8, "Mínimo 8 caracteres"),
})

const profesionalSchema = baseSchema.extend({
  role: z.enum(["agent", "admin"]),
  ci: z.string().trim().min(4, "Requerido"),
  direccion: z.string().trim().min(8, "Selecciona una dirección válida"),
  ocupacion: z.string().trim().min(3, "Requerido"),
  fechaNacimiento: z.string().trim().min(1, "Requerido"),
  fotoUrl: z.string().trim().url("Sube una imagen válida"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

const clienteSchema = baseSchema.refine(
  data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
}
)

const baseValues = {
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  username: "",
  password: "",
  confirmPassword: "",
}

const profesionalValues = {
  ...baseValues,
  role: "agent",
  ci: "",
  direccion: "",
  ocupacion: "",
  fechaNacimiento: "",
  fotoUrl: "",
}

export const useFormRegister = (tipo = "cliente") => {
  const isProfesional = tipo === "profesional"

  return {
    defaultValues: isProfesional ? profesionalValues : baseValues,
    schema: isProfesional ? profesionalSchema : clienteSchema,
  }
}