import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  listarPermisos,
} from "../api/permisoApi"

export const usePermiso = (filtros = {}) => {
  const queryClient = useQueryClient()

  const permisos = useQuery({
    queryKey: ["permisos", filtros],
    queryFn:  () => listarPermisos(filtros),
    keepPreviousData: true,
  })

  return { permisos }
}