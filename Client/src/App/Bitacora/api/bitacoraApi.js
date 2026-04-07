import { intanciaAxios } from "../../../config/axios"

export const listarBitacora = async () => {
  // Ajusta la URL a como la tengas en urls.py del backend
  const { data } = await intanciaAxios.get("/gestion_usuarios/bitacora/") 
  return data
}