import { intanciaAxios } from "../../../../config/axios"

const CONTRATOS_URL = "/api/contratos/";
const DOCUMENTOS_URL = "/api/documentos-contrato/";
const USUARIOS_URL = "/gestion_usuarios/usuarios/";
const PROPIEDADES_URL = "/api/inmuebles/propiedades/";

// =====================
// CONTRATOS
// =====================
export const obtenerContratos = async () => {
  const { data } = await intanciaAxios.get(CONTRATOS_URL);
  return data;
};

export const obtenerResumenContratos = async () => {
  const { data } = await intanciaAxios.get(`${CONTRATOS_URL}resumen/`);
  return data;
};

export const createContrato = async (payload) => {
  try {
    const { data } = await intanciaAxios.post(CONTRATOS_URL, payload);
    return data;
  } catch (error) {
    console.log("ERROR BACKEND:", error.response?.data);
    throw error;
  }
};

export const updateContrato = async (id, payload) => {
  const { data } = await intanciaAxios.put(`${CONTRATOS_URL}${id}/`, payload);
  return data;
};

export const exportarContratoPDF = async (id) => {
  const response = await intanciaAxios.get(
    `${CONTRATOS_URL}${id}/exportar_pdf/`,
    {
      responseType: "blob"
    }
  );

  const blob = new Blob([response.data], {
    type: "application/pdf"
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `contrato_${id}.pdf`;
  link.click();

  window.URL.revokeObjectURL(url);
};

export const obtenerContrato = async (id) => {
  const { data } = await intanciaAxios.get(`${CONTRATOS_URL}${id}/`);
  return data;
};

export const obtenerDocumentosContrato = async (idContrato) => {
  const { data } = await intanciaAxios.get(
    `${DOCUMENTOS_URL}?contrato=${idContrato}`
  );
  return data;
};

export const buscarClientes = async (search = "") => {
  const { data } = await intanciaAxios.get(
    `${USUARIOS_URL}buscar_clientes/?q=${search}`
  );
  return data;
};

export const buscarAgentes = async (search = "") => {
  const { data } = await intanciaAxios.get(
    `${USUARIOS_URL}buscar_agentes/?q=${search}`
  );
  return data;
};

export const buscarPropiedades = async (search = "") => {
  const { data } = await intanciaAxios.get(
    `${PROPIEDADES_URL}?search=${search}`
  );

  return data.results || data;
};

export const obtenerPagosContrato = async (idContrato) => {
  const { data } = await intanciaAxios.get(
    `/api/pagos/?contrato=${idContrato}`
  );
  return data;
};