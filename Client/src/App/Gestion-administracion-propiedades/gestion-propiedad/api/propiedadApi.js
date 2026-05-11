import { intanciaAxios } from "../../../../config/axios";

export const getPropiedades = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== "" && value !== undefined) {
      params.append(key, value);
    }
  });

  const { data } = await intanciaAxios.get(
    `/api/inmuebles/propiedades/?${params.toString()}`
  );

  return data.results ?? data;
};

export const createPropiedad = async (formData) => {
  const { data } = await intanciaAxios.post(
    "/api/inmuebles/propiedades/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return data;
};

export const updatePropiedad = async (id, payload) => {
  const response = await intanciaAxios.put(
    `/api/inmuebles/propiedades/${id}/`,
    payload
  );

  return response.data;
};