import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000/api";

const ENDPOINTS = {
  propiedades: "/propiedades/reporte/",
  clientes: "/clientes/reporte/",
  contratos: "/contratos/reporte/",
  operaciones: "/operaciones/reporte/",
};

const GLOBAL_ENDPOINT = "/admin-config/reportes-globales/";

export const fetchReporte = async (tipo, params, tenantId) => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await axios.get(`${API_URL}${endpoint}`, {
    params,
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
    withCredentials: true,
  });
  return response.data;
};

export const downloadReportePdf = async (tipo, params, tenantId) => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await axios.get(`${API_URL}${endpoint}`, {
    params: { ...params, format: "pdf" },
    responseType: "blob",
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
    withCredentials: true,
  });
  return response.data;
};

export const downloadReporte = async (tipo, params, tenantId, format = "pdf") => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await axios.get(`${API_URL}${endpoint}`, {
    params: { ...params, format },
    responseType: "blob",
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
    withCredentials: true,
  });
  return response.data;
};

export const fetchReporteGlobal = async (tipo, params) => {
  const response = await axios.get(`${API_URL}${GLOBAL_ENDPOINT}`, {
    params: { ...params, tipo },
    withCredentials: true,
  });
  return response.data;
};

export const downloadReporteGlobalPdf = async (tipo, params) => {
  const response = await axios.get(`${API_URL}${GLOBAL_ENDPOINT}`, {
    params: { ...params, tipo, format: "pdf" },
    responseType: "blob",
    withCredentials: true,
  });
  return response.data;
};

export const downloadReporteGlobal = async (tipo, params, format = "pdf") => {
  const response = await axios.get(`${API_URL}${GLOBAL_ENDPOINT}`, {
    params: { ...params, tipo, format },
    responseType: "blob",
    withCredentials: true,
  });
  return response.data;
};
