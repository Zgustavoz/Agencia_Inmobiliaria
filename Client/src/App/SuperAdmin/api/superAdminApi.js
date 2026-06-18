import axios from 'axios';

// Usamos la URL base configurada en el proyecto
const API_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8000/api';

export const getTenants = async () => {
    const response = await axios.get(`${API_URL}/admin-config/admin-tenants/`, {
        withCredentials: true
    });
    return response.data;
};

export const getTenantDetail = async (id) => {
    const response = await axios.get(`${API_URL}/admin-config/admin-tenants/${id}/`, {
        withCredentials: true
    });
    return response.data;
};

export const getGlobalStats = async () => {
    const response = await axios.get(`${API_URL}/admin-config/admin-tenants/stats_globales/`, {
        withCredentials: true
    });
    return response.data;
};

export const updateTenantStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/admin-config/admin-tenants/${id}/`, 
    { estado: status },
    { withCredentials: true });
    return response.data;
};

export const provisionTenant = async (data) => {
    const response = await axios.post(`${API_URL}/admin-config/admin-tenants/provisionar/`, 
    data,
    { withCredentials: true });
    return response.data;
};
