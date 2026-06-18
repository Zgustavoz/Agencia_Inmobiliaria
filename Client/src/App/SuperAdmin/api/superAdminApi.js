<<<<<<< HEAD
import axios from 'axios';

// Usamos la URL base configurada en el proyecto
const API_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8000/api';
=======
import { intanciaAxios } from '../../../config/axios';
>>>>>>> af027a66c56978e6544e79698df34c465b47eca1

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
