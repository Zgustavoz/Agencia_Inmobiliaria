import axios from "axios";

const API_URL = "/api/admin-config/estadisticas/";

export const obtenerEstadisticas = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};