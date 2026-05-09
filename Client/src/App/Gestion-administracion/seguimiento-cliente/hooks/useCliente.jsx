import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  listarClientes, obtenerCliente, crearCliente,
  actualizarCliente, eliminarCliente, obtenerResumenCliente,
  crearInteraccion, crearOportunidad, crearRecordatorio, asignarAgente,
} from "../api/clienteApi"

export const useCliente = (filtros = {}) => {
  const queryClient = useQueryClient()

  const clientes = useQuery({
    queryKey:        ["clientes", filtros],
    queryFn:         () => listarClientes(filtros),
    keepPreviousData: true,
  })

  const crear = useMutation({
    mutationFn: crearCliente,
    onSuccess:  () => {
      queryClient.invalidateQueries(["clientes"])
      toast.success("Cliente creado exitosamente")
    },
    onError: () => toast.error("Error al crear cliente"),
  })

  const actualizar = useMutation({
    mutationFn: actualizarCliente,
    onSuccess:  () => {
      queryClient.invalidateQueries(["clientes"])
      toast.success("Cliente actualizado exitosamente")
    },
    onError: () => toast.error("Error al actualizar cliente"),
  })

  const eliminar = useMutation({
    mutationFn: eliminarCliente,
    onSuccess:  () => {
      queryClient.invalidateQueries(["clientes"])
      toast.success("Cliente eliminado exitosamente")
    },
    onError: () => toast.error("Error al eliminar cliente"),
  })

  return { clientes, crear, actualizar, eliminar }
}

export const useClienteDetalle = (id) => {
  const queryClient = useQueryClient()

  const resumen = useQuery({
    queryKey: ["cliente-resumen", id],
    queryFn:  () => obtenerResumenCliente(id),
    enabled:  !!id,
  })

  const agregarInteraccion = useMutation({
    mutationFn: ({ payload }) => crearInteraccion({ clienteId: id, payload }),
    onSuccess:  () => {
      queryClient.invalidateQueries(["cliente-resumen", id])
      toast.success("Interacción registrada")
    },
    onError: () => toast.error("Error al registrar interacción"),
  })

  const agregarOportunidad = useMutation({
    mutationFn: ({ payload }) => crearOportunidad({ clienteId: id, payload }),
    onSuccess:  () => {
      queryClient.invalidateQueries(["cliente-resumen", id])
      toast.success("Oportunidad registrada")
    },
    onError: () => toast.error("Error al registrar oportunidad"),
  })

  const agregarRecordatorio = useMutation({
    mutationFn: ({ payload }) => crearRecordatorio({ clienteId: id, payload }),
    onSuccess:  () => {
      queryClient.invalidateQueries(["cliente-resumen", id])
      toast.success("Recordatorio creado")
    },
    onError: () => toast.error("Error al crear recordatorio"),
  })

  return { resumen, agregarInteraccion, agregarOportunidad, agregarRecordatorio }
}