import axios from "axios"

const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000"

export const listarBitacoraGlobal = async () => {
  const response = await axios.get(`${API_URL}/gestion_usuarios/global-bitacora/`, {
    withCredentials: true,
  })
  return response.data
}

export const verificarClaveBitacoraGlobal = async (password) => {
  const response = await axios.post(
    `${API_URL}/gestion_usuarios/global-bitacora/verificar-clave/`,
    { password },
    { withCredentials: true }
  )
  return response.data
}
