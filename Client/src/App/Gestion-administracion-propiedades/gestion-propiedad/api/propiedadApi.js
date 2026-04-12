import { intanciaAxios } from "../../../../config/axios";

export const getPropiedades = async (params = {}) => {
  const { data } = await intanciaAxios.get("/api/inmuebles/propiedades/", { params });
  return data;
};

export const createPropiedad = async (formData) => {
  const { data } = await intanciaAxios.post("/api/inmuebles/propiedades/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};
export const updatePropiedad = async (id, data) => {
  // Ajusta la URL según tu backend de Django (usualmente es /id/)
  const response = await intanciaAxios.put(`/api/inmuebles/propiedades/${id}/`, data);
  return response.data;
};
