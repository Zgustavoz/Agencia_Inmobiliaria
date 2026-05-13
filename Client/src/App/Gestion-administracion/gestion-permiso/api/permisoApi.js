import { intanciaAxios } from "../../../../config/axios"

export const listarPermisos = async (params = {}) => {
  const { data } = await intanciaAxios.get("/gestion_usuarios/permisos/", { params })
  return data
}