import { useEffect, useState } from "react";
import {
  obtenerContratos,
  obtenerResumenContratos
} from "../api/contratoApi";

export const useContratos = () => {
  const [contratos, setContratos] = useState([]);
  const [stats, setStats] = useState({
    activos: 0,
    vencidos: 0,
    finalizados: 0,
    borradores: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const contratosData = await obtenerContratos();
      const resumenData = await obtenerResumenContratos();

      setContratos(contratosData);
      setStats(resumenData);

    } catch (error) {
      console.error("Error cargando contratos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    contratos,
    stats,
    isLoading,
    refetch: fetchData
  };
};