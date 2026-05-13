import { intanciaAxios } from "../../../../config/axios";

export const getVisitas = async (params = {}) => {
  const { data } = await intanciaAxios.get("/api/clientes/visitas/", {
    params,
  });
  return data;
};

export const createVisita = async (formData) => {
  const { data } = await intanciaAxios.post("/api/clientes/visitas/", formData);
  return data;
};

export const updateVisita = async (id, data) => {
  const response = await intanciaAxios.patch(
    `/api/clientes/visitas/${id}/`,
    data,
  );
  return response.data;
};

export const getHorariosDisponibilidad = async (params = {}) => {
  const { data } = await intanciaAxios.get(
    "/api/clientes/horarios-disponibilidad/",
    { params },
  );
  return data;
};

export const createHorarioDisponibilidad = async (data) => {
  const res = await intanciaAxios.post(
    "/api/clientes/horarios-disponibilidad/",
    data,
  );
  return res.data;
};

export const deleteHorarioDisponibilidad = async (id) => {
  await intanciaAxios.delete(`/api/clientes/horarios-disponibilidad/${id}/`);
};
// Para el listado de la izquierda (usa ClienteListSerializer)
export const getClientes = async (params = {}) => {
  const { data } = await intanciaAxios.get("/api/clientes/clientes/", {
    params,
  });
  return data; // Retorna la paginación { results: [...] }
};

// Para el detalle de la derecha (usa ClienteSerializer con todo anidado)
export const getClienteDetalle = async (id) => {
  const { data } = await intanciaAxios.get(`/api/clientes/clientes/${id}/`);
  return data;
};
