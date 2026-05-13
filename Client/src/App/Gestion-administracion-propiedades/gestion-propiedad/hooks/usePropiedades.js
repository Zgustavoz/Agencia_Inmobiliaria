import { useState, useEffect, useCallback, useMemo } from "react";
import { getPropiedades } from "../api/propiedadApi";

export const usePropiedades = (search = "") => {
    const [propiedades, setPropiedades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPropiedades = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getPropiedades({ search });
            // Mantenemos tu lógica original: extraemos la lista
            const lista = data.results || data;
            setPropiedades(Array.isArray(lista) ? lista : []);
        } catch (error) {
            console.error("Error al obtener propiedades:", error);
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchPropiedades();
    }, [fetchPropiedades]);

    // Lógica de conteo segura
    const stats = useMemo(() => {
        // Aseguramos que siempre trabajamos sobre un array
        const lista = Array.isArray(propiedades) ? propiedades : [];
        
        return {
            total: lista.length,
            // IMPORTANTE: Asegúrate de que "For Sale" y "For Rent" coincidan con tu base de datos
            ventas: lista.filter(p => p.modalidad_operacion === "Para Vender").length,
            rentas: lista.filter(p => p.modalidad_operacion === "Para Rentar").length,
        };
    }, [propiedades]);

    return { 
        propiedades, 
        isLoading, 
        stats, // <--- Ahora sí lo enviamos
        refetch: fetchPropiedades 
    };
};