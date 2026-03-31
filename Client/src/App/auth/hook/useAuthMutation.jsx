// import { useMutation } from "@tanstack/react-query"
// import { loginRequest, registerRequest } from "../api/authApi"
// import { useNavigate } from "react-router"
// import toast from "react-hot-toast"

// export const useLoginMutation = () => {
//   const navigate = useNavigate()
//   return useMutation({
//     mutationFn: loginRequest,
//     onSuccess: () => {
//       toast.success("Bienvenido 👋")
//       navigate("/Client")
//       console.log("Login exitoso, redirigiendo a la página principal...")
//     }
//   })
// }

// export const useRegisterMutation = () => {
//   const navigate = useNavigate()
//   return useMutation({
//     mutationFn: registerRequest,
//     onSuccess: () => {
//       toast.success("Cuenta creada correctamente 🎉")
//       navigate("/auth")
//       console.log("Registro exitoso, redirigiendo a la página de inicio de sesión...")
//     },
//     onError: (error) => {
//       toast.error("Error en el registro")
//       console.error("Error en el registro:", { error })
//     }
//   })
// }

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  recuperarPasswordRequest,
  restablecerPasswordRequest,
  obtenerPerfil,
} from "../api/authApi"
import { useAuth as useAuthContext } from "../context/AuthContext"

export const useAuth = () => {
  const queryClient                    = useQueryClient()
  const navigate                       = useNavigate()
  const { login: contextLogin, logout: contextLogout } = useAuthContext()

  const login = useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      const perfil = await obtenerPerfil()
      contextLogin(perfil)
      toast.success("¡Bienvenido!")
      const esAdmin = perfil.es_admin || perfil.roles_info?.some(r => r.nombre === "Administrador")
      navigate(esAdmin ? "/dashboard" : "/cliente")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Credenciales incorrectas")
    },
  })

  const registro = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      toast.success(data.message || "¡Cuenta creada correctamente!")
      setTimeout(() => navigate("/auth"), 2000)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error al registrarse")
    },
  })

  const recuperarPassword = useMutation({
    mutationFn: ({ email }) => recuperarPasswordRequest(email),
    onSuccess: (data) => toast.success(data.message || "Revisa tu email"),
    onError:   () => toast.error("Error al solicitar recuperación"),
  })

  const restablecer = useMutation({
    mutationFn: restablecerPasswordRequest,
    onSuccess: (data) => {
      toast.success(data.message || "Contraseña actualizada")
      setTimeout(() => navigate("/auth"), 2000)
    },
    onError: () => toast.error("Error al restablecer contraseña"),
  })

  const logout = async () => {
    try {
      await logoutRequest()
    } catch {
      // si falla igual limpiamos
    }
    contextLogout()
    queryClient.clear()
    toast.success("Sesión cerrada")
    navigate("/auth")
  }

  return { login, registro, recuperarPassword, restablecer, logout }
}

// ── Exports individuales para compatibilidad con lo que ya tenías ──
export const useLoginMutation    = () => useAuth().login
export const useRegisterMutation = () => useAuth().registro
