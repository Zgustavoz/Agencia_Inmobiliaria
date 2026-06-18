import { intanciaAxios } from "../../../config/axios"

export const listarBitacoraGlobal = async () => {
  const response = await intanciaAxios.get("/gestion_usuarios/global-bitacora/")
  return response.data
}

export const verificarClaveBitacoraGlobal = async (password) => {
  const response = await intanciaAxios.post(
    "/gestion_usuarios/global-bitacora/verificar-clave/",
    { password }
  )
  return response.data
}
