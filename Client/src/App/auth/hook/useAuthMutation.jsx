import { useMutation } from "@tanstack/react-query"
import { loginRequest, registerRequest } from "../api/authApi"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

export const useLoginMutation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      toast.success("Bienvenido 👋")
      navigate("/Client")
      console.log("Login exitoso, redirigiendo a la página principal...")
    }
  })
}

export const useRegisterMutation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: () => {
      toast.success("Cuenta creada correctamente 🎉")
      navigate("/auth")
      console.log("Registro exitoso, redirigiendo a la página de inicio de sesión...")
    },
    onError: (error) => {
      toast.error("Error en el registro")
      console.error("Error en el registro:", { error })
    }
  })
}
