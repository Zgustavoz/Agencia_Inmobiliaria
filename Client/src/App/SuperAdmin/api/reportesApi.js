import { intanciaAxios } from "../../../config/axios";

const ENDPOINTS = {
  propiedades: "/api/inmuebles/propiedades/reporte/",
  clientes: "/api/clientes/clientes/reporte/",
  contratos: "/api/contratos/reporte/",
  operaciones: "/api/operaciones/reporte/",
};

const GLOBAL_ENDPOINT = "/api/admin-config/reportes-globales/";

export const fetchReporte = async (tipo, params, tenantId) => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await intanciaAxios.get(endpoint, {
    params,
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
  });
  return response.data;
};

export const downloadReportePdf = async (tipo, params, tenantId) => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await intanciaAxios.get(endpoint, {
    params: { ...params, format: "pdf" },
    responseType: "blob",
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
  });
  return response.data;
};

export const downloadReporte = async (tipo, params, tenantId, format = "pdf") => {
  const endpoint = ENDPOINTS[tipo];
  if (!endpoint) throw new Error("Tipo de reporte no soportado");
  const response = await intanciaAxios.get(endpoint, {
    params: { ...params, format },
    responseType: "blob",
    headers: tenantId ? { "X-Tenant-Id": String(tenantId) } : {},
  });
  return response.data;
};

export const fetchReporteGlobal = async (tipo, params) => {
  const response = await intanciaAxios.get(GLOBAL_ENDPOINT, {
    params: { ...params, tipo },
  });
  return response.data;
};

export const downloadReporteGlobalPdf = async (tipo, params) => {
  const response = await intanciaAxios.get(GLOBAL_ENDPOINT, {
    params: { ...params, tipo, format: "pdf" },
    responseType: "blob",
  });
  return response.data;
};

export const downloadReporteGlobal = async (tipo, params, format = "pdf") => {
  const response = await intanciaAxios.get(GLOBAL_ENDPOINT, {
    params: { ...params, tipo, format },
    responseType: "blob",
  });
  return response.data;
};
