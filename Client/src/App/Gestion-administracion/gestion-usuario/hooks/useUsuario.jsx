import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  listarUsuarios, crearUsuario, actualizarUsuario,
  eliminarUsuario, toggleEstadoUsuario,
} from "../api/usuarioApi"

export const useUsuario = (filtros = {}) => {
  const queryClient = useQueryClient()

  const usuarios = useQuery({
    queryKey:    ["usuarios", filtros],
    queryFn:     () => listarUsuarios(filtros),
    keepPreviousData: true,
  })

  const crear = useMutation({
    mutationFn: crearUsuario,
    onSuccess:  () => {
      queryClient.invalidateQueries(["usuarios"])
      toast.success("Usuario creado exitosamente")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.username?.[0] || error?.response?.data?.email?.[0] || "Error al crear usuario")
    },
  })

  const actualizar = useMutation({
    mutationFn: actualizarUsuario,
    onSuccess:  () => {
      queryClient.invalidateQueries(["usuarios"])
      toast.success("Usuario actualizado exitosamente")
    },
    onError: () => toast.error("Error al actualizar usuario"),
  })

  const eliminar = useMutation({
    mutationFn: eliminarUsuario,
    onSuccess:  () => {
      queryClient.invalidateQueries(["usuarios"])
      toast.success("Usuario eliminado exitosamente")
    },
    onError: () => toast.error("Error al eliminar usuario"),
  })

  const toggleEstado = useMutation({
    mutationFn: toggleEstadoUsuario,
    onSuccess:  () => {
      queryClient.invalidateQueries(["usuarios"])
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error al cambiar estado")
    },
  })

  return { usuarios, crear, actualizar, eliminar, toggleEstado }
}