import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  listarRoles, crearRol, actualizarRol,
  eliminarRol, toggleEstadoRol,
} from "../api/rolApi"

export const useRol = (filtros = {}) => {
  const queryClient = useQueryClient()

  const roles = useQuery({
    queryKey: ["roles", filtros],
    queryFn:  () => listarRoles(filtros),
    keepPreviousData: true,
  })

  const crear = useMutation({
    mutationFn: crearRol,
    onSuccess:  () => {
      queryClient.invalidateQueries(["roles"])
      toast.success("Rol creado exitosamente")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.nombre?.[0] || "Error al crear rol")
    },
  })

  const actualizar = useMutation({
    mutationFn: actualizarRol,
    onSuccess:  () => {
      queryClient.invalidateQueries(["roles"])
      toast.success("Rol actualizado exitosamente")
    },
    onError: () => toast.error("Error al actualizar rol"),
  })

  const eliminar = useMutation({
    mutationFn: eliminarRol,
    onSuccess:  () => {
      queryClient.invalidateQueries(["roles"])
      toast.success("Rol eliminado exitosamente")
    },
    onError: () => toast.error("Error al eliminar rol"),
  })

  const toggleEstado = useMutation({
    mutationFn: toggleEstadoRol,
    onSuccess:  () => queryClient.invalidateQueries(["roles"]),
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error al cambiar estado")
    },
  })

  return { roles, crear, actualizar, eliminar, toggleEstado }
}