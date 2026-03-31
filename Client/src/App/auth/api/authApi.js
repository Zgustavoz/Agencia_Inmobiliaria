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