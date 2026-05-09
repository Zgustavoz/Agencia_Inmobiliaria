import { intanciaAxios } from "../../../../config/axios"

export const listarClientes = async (params = {}) => {
  const { data } = await intanciaAxios.get("/api/clientes/clientes/", { params })
  return data
}

export const obtenerCliente = async (id) => {
  const { data } = await intanciaAxios.get(`/api/clientes/clientes/${id}/`)
  return data
}

export const crearCliente = async (payload) => {
  const { data } = await intanciaAxios.post("/api/clientes/clientes/", payload)
  return data
}

export const actualizarCliente = async ({ id, payload }) => {
  const { data } = await intanciaAxios.put(`/api/clientes/clientes/${id}/`, payload)
  return data
}

export const eliminarCliente = async (id) => {
  const { data } = await intanciaAxios.delete(`/api/clientes/clientes/${id}/`)
  return data
}

export const obtenerResumenCliente = async (id) => {
  const { data } = await intanciaAxios.get(`/api/clientes/clientes/${id}/resumen/`)
  return data
}

export const crearInteraccion = async ({ clienteId, payload }) => {
  const { data } = await intanciaAxios.post(`/api/clientes/clientes/${clienteId}/interacciones/`, payload)
  return data
}

export const crearOportunidad = async ({ clienteId, payload }) => {
  const { data } = await intanciaAxios.post(`/api/clientes/clientes/${clienteId}/oportunidades/`, payload)
  return data
}

export const crearRecordatorio = async ({ clienteId, payload }) => {
  const { data } = await intanciaAxios.post(`/api/clientes/clientes/${clienteId}/recordatorios/`, payload)
  return data
}

export const asignarAgente = async ({ clienteId, agente_id }) => {
  const { data } = await intanciaAxios.post(`/api/clientes/clientes/${clienteId}/asignar_agente/`, { agente_id })
  return data
}