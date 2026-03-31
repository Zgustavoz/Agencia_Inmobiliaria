import { intanciaAxios } from "../../../../config/axios"

export const listarUsuarios = async (params = {}) => {
  const { data } = await intanciaAxios.get("/gestion_usuarios/usuarios/", { params })
  return data
}

export const crearUsuario = async (payload) => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/usuarios/", payload)
  return data
}

export const actualizarUsuario = async ({ id, payload }) => {
  const { data } = await intanciaAxios.put(`/gestion_usuarios/usuarios/${id}/`, payload)
  return data
}

export const eliminarUsuario = async (id) => {
  const { data } = await intanciaAxios.delete(`/gestion_usuarios/usuarios/${id}/`)
  return data
}

export const toggleEstadoUsuario = async (id) => {
  const { data } = await intanciaAxios.post(`/gestion_usuarios/usuarios/${id}/toggle_estado/`)
  return data
}