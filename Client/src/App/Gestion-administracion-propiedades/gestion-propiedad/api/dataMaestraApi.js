// Client\src\App\modulo_inmuebles\api\dataMaestraApi.js
import { intanciaAxios } from "../../../../config/axios";

export const getZonas = async () => {
    // Ruta confirmada por ti
    const { data } = await intanciaAxios.get("/api/inmuebles/zonas/");
    return data;
};

export const getMonedas = async () => {
    // Ruta confirmada por ti (corregida de admin-config)
    const { data } = await intanciaAxios.get("/api/admin-config/monedas/");
    return data;
};