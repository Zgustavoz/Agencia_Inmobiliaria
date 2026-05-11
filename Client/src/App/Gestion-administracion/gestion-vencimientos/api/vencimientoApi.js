import { intanciaAxios } from "../../../../config/axios"

const PREFIX = "/api/vencimientos"

export const obtenerVencimientos = async (dias = 30) => {
  const { data } = await intanciaAxios.get(`${PREFIX}/`, {
    params: { dias },
  })
  return data
}

export const crearVencimiento = async (payload) => {
  const { data } = await intanciaAxios.post(`${PREFIX}/`, payload)
  return data
}
