import { useMutation } from "@tanstack/react-query"
import { loginRequest, registerRequest } from "../api/authApi"
import { useNavigate } from "react-router"

export const useLoginMutation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      navigate("/Client")
      console.log("Login exitoso, redirigiendo a la página principal...")
    }
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
