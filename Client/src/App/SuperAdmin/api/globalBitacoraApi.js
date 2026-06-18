<<<<<<< HEAD
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000"
=======
import { intanciaAxios } from "../../../config/axios"
>>>>>>> af027a66c56978e6544e79698df34c465b47eca1

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
