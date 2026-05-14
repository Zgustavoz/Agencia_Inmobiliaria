import { useState, useEffect } from "react";
import { agenteAPI } from "../api/agentes";

export const useAsignarAgentes = () => {
  const [clientesConAgentes, setClientesConAgentes] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [typeaheadSuggestions, setTypeaheadSuggestions] = useState([]);
  const [searchingSuggestions, setSearchingSuggestions] = useState(false);
  const debounceRef = { current: null };

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

  // Typeahead / suggestions
  const buscarSugerencias = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || !query.trim()) {
      setTypeaheadSuggestions([]);
      return;
    }
    setSearchingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const sugerencias = await agenteAPI.buscarClientesParciales(query);
        setTypeaheadSuggestions(sugerencias);
      } catch (err) {
        setTypeaheadSuggestions([]);
      } finally {
        setSearchingSuggestions(false);
      }
    }, 250);
  };

  const crearClienteRapido = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await agenteAPI.crearClienteRapido(data);
      await buscarClientes("");
      return { success: true, cliente: nuevo };
    } catch (err) {
      const errorMsg = err.message || "Error al crear cliente";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const actualizarClientePartial = async (clienteId, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await agenteAPI.actualizarClientePartial(clienteId, data);
      await buscarClientes(searchQuery);
      return { success: true, cliente: res.cliente };
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar cliente";
      setError(errorMsg);
      return { success: false, error: errorMsg };
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
    setError,
    typeaheadSuggestions,
    buscarSugerencias,
    searchingSuggestions,
    crearClienteRapido,
    actualizarClientePartial
  };
};
