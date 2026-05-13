import { intanciaAxios } from "../../../config/axios"

export const loginRequest = async ({ username, password }) => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/auth/login/", { username, password })
  return data
}

export const registerRequest = async ({ username, email, nombres, apellidos, telefono, password, password2 }) => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/auth/registro/", {
    username, email, nombres, apellidos, telefono, password, password2,
  })
  return data
}

export const logoutRequest = async () => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/auth/logout/")
  return data
}

export const refreshRequest = async () => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/auth/refresh/")
  return data
}

export const obtenerPerfil = async () => {
  const { data } = await intanciaAxios.get("/gestion_usuarios/usuarios/me/")
  return data
}

export const recuperarPasswordRequest = async (email) => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/auth/recuperar-password/", { email })
  return data
}

export const restablecerPasswordRequest = async ({ uidb64, token, new_password }) => {
  const { data } = await intanciaAxios.post(
    `/gestion_usuarios/auth/restablecer-password/${uidb64}/${token}/`,
    { new_password }
  )
  return data
}

export const registerProfesionalRequest = async (data) => {
  const { data: responseData } = await intanciaAxios.post(
    "/gestion_usuarios/auth/registro-agente/",
    {
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      username: data.username,
      password_hash: data.password,
      foto_url: data.fotoUrl,
      role: data.role,
    }
  )

  return responseData
}

export const uploadAuthImageRequest = async (file, folder = "users/profiles") => {
  const formData = new FormData()
  formData.append("imagen", file)
  formData.append("folder", folder)

  const { data } = await intanciaAxios.post("/gestion_usuarios/upload-image/", formData)
  return data
}
