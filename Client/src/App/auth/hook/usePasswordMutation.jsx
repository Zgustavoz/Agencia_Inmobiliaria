import { useMutation } from "@tanstack/react-query"
import { recuperarPasswordRequest, restablecerPasswordRequest } from "../api/authApi"

export const useRecuperarPasswordMutation = () => {
  return useMutation({
    mutationFn: recuperarPasswordRequest,
    onError: (error) => {
      console.error("Error al solicitar recuperación de contraseña:", { error })
    },
  })
}

export const useRestablecerPasswordMutation = () => {
  return useMutation({
    mutationFn: restablecerPasswordRequest,
    onError: (error) => {
      console.error("Error al restablecer contraseña:", { error })
    },
  })
}
