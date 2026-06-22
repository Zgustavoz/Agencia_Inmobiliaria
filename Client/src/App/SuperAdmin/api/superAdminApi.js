import { intanciaAxios } from '../../../config/axios';

export const getTenants = async () => {
    const response = await intanciaAxios.get("/api/admin-config/admin-tenants/");
    return response.data;
};

export const getTenantDetail = async (id) => {
    const response = await intanciaAxios.get(`/api/admin-config/admin-tenants/${id}/`);
    return response.data;
};

export const getGlobalStats = async () => {
    const response = await intanciaAxios.get("/api/admin-config/admin-tenants/stats_globales/");
    return response.data;
};

export const updateTenantStatus = async (id, status) => {
    const response = await intanciaAxios.patch(`/api/admin-config/admin-tenants/${id}/`, 
    { estado: status });
    return response.data;
};

export const provisionTenant = async (data) => {
    const response = await intanciaAxios.post("/api/admin-config/admin-tenants/provisionar/", data);
    return response.data;
};
