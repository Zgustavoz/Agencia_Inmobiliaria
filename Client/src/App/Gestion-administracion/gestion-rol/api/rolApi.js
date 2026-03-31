import { intanciaAxios } from "../../../../config/axios"

export const listarRoles = async (params = {}) => {
  const { data } = await intanciaAxios.get("/gestion_usuarios/roles/", { params })
  return data
}

export const crearRol = async (payload) => {
  const { data } = await intanciaAxios.post("/gestion_usuarios/roles/", payload)
  return data
}

export const actualizarRol = async ({ id, payload }) => {
  const { data } = await intanciaAxios.put(`/gestion_usuarios/roles/${id}/`, payload)
  return data
}

export const eliminarRol = async (id) => {
  const { data } = await intanciaAxios.delete(`/gestion_usuarios/roles/${id}/`)
  return data
}

export const toggleEstadoRol = async (id) => {
  const { data } = await intanciaAxios.post(`/gestion_usuarios/roles/${id}/toggle_estado/`)
  return data
}