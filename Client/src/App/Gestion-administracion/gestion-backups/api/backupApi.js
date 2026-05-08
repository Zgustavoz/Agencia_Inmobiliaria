import { intanciaAxios } from "../../../../config/axios";

// Ajustamos el prefijo para que coincida con path('api/admin-config/', ...) de tu config/urls.py
const PREFIX = "/api/admin-config/backups";

export const listarBackups = async () => {
  // Django necesita el "/" al final: /api/admin-config/backups/
  const { data } = await intanciaAxios.get(`${PREFIX}/`);
  return data.backups;
};

export const crearBackup = async () => {
  const { data } = await intanciaAxios.post(`${PREFIX}/`);
  return data;
};

export const restaurarBackup = async (filename) => {
  // Ruta: /api/admin-config/backups/restaurar/nombre_archivo.sql/
  const { data } = await intanciaAxios.post(`${PREFIX}/restaurar/${filename}/`);
  return data;
};
