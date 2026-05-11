import { intanciaAxios } from "../../../../config/axios"

const CONTRATOS_URL = "/contratos/";
const DOCUMENTOS_URL = "/documentos-contrato/";
const USUARIOS_URL = "/usuarios/";
const PROPIEDADES_URL = "/propiedades/";

export const obtenerContratos = async () => {
  const { data } = await instanciaAxios.get(CONTRATOS_URL);
  return data;
};

export const obtenerResumenContratos = async () => {
  const { data } = await instanciaAxios.get(`${CONTRATOS_URL}resumen/`);
  return data;
};

export const createContrato = async (payload) => {
  const { data } = await instanciaAxios.post(CONTRATOS_URL, payload);
  return data;
};

export const updateContrato = async (id, payload) => {
  const { data } = await instanciaAxios.put(`${CONTRATOS_URL}${id}/`, payload);
  return data;
};

export const exportarContratoPDF = async (id) => {
  const response = await instanciaAxios.get(
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

export const obtenerDocumentosContrato = async (idContrato) => {
  const { data } = await instanciaAxios.get(
    `${DOCUMENTOS_URL}?contrato=${idContrato}`
  );

  return data;
};

export const buscarClientes = async (search = "") => {
  const { data } = await instanciaAxios.get(
    `${USUARIOS_URL}?search=${search}`
  );

  return data.results || data;
};

export const buscarAgentes = async (search = "") => {
  const { data } = await instanciaAxios.get(
    `${USUARIOS_URL}?search=${search}`
  );

  return data.results || data;
};

export const buscarPropiedades = async (search = "") => {
  const { data } = await instanciaAxios.get(
    `${PROPIEDADES_URL}?search=${search}`
  );

  return data.results || data;
};