import { useState, useEffect } from "react";
import { agenteAPI } from "../api/agentes";

export const useAsignarAgentes = () => {
  const [clientesConAgentes, setClientesConAgentes] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (searchQuery || filtroEstado !== "todos") {
      buscarClientes(searchQuery);
    }
  }, [filtroEstado]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientes, agentesList] = await Promise.all([
        agenteAPI.obtenerClientesConAgentes("", "todos"),
        agenteAPI.obtenerAgentes()
      ]);
      setClientesConAgentes(clientes);
      setAgentes(agentesList);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const buscarClientes = async (query) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    try {
      const clientes = await agenteAPI.obtenerClientesConAgentes(query, filtroEstado);
      setClientesConAgentes(clientes);
    } catch (err) {
      setError(err.message || "Error al buscar clientes");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorEstado = (estado) => {
    setFiltroEstado(estado);
  };

  const asignarAgente = async (clienteId, agenteId) => {
    setLoading(true);
    setError(null);
    try {
      await agenteAPI.asignarAgente(clienteId, agenteId);
      await buscarClientes(searchQuery);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Error al asignar agente";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const desasignarAgente = async (clienteId) => {
    setLoading(true);
    setError(null);
    try {
      await agenteAPI.desasignarAgente(clienteId);
      await buscarClientes(searchQuery);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Error al desasignar agente";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    clientesConAgentes,
    agentes,
    loading,
    error,
    searchQuery,
    filtroEstado,
    buscarClientes,
    filtrarPorEstado,
    asignarAgente,
    desasignarAgente,
    setError
  };
};
