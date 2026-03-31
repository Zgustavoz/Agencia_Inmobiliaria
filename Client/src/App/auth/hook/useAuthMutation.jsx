import { useMutation } from "@tanstack/react-query"
import { loginRequest, registerProfesionalRequest, registerRequest } from "../api/authApi"
import { useNavigate } from "react-router"

export const useLoginMutation = (options = {}) => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, variables, context) => {
      navigate("/client")
      options.onSuccess?.(data, variables, context)
    },
    onError: options.onError,
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      console.log("Registro exitoso, redirigiendo a la página de inicio de sesión...")
    },
    onError: (error) => {
      console.error("Error en el registro:", { error })
    }
  })
}

export const useRegisterProfesionalMutation = () => {
  return useMutation({
    mutationFn: registerProfesionalRequest,
    onError: (error) => {
      console.error("Error en el registro profesional:", { error })
    },
  })
}
