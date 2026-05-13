import axios from "axios"

export const intanciaAxios = axios.create({
  baseURL:         import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000",
  withCredentials: true,
})

intanciaAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/") &&
      !originalRequest.url.includes("/me/")
    ) {
      originalRequest._retry = true

      try {
        await intanciaAxios.post("/gestion_usuarios/auth/refresh/")
        return intanciaAxios(originalRequest)
      } catch {
        // window.location.href = "/auth"
      }
    }

    // Detectar errores de suscripción o límites de plan (403)
    if (error.response?.status === 403) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        ''

      const texto = String(msg).toLowerCase()
      if (
        texto.includes('suscrip') ||
        texto.includes('vencid') ||
        texto.includes('límite') ||
        texto.includes('límite de') ||
        texto.includes('has alcanzado')
      ) {
        // Redirección SPA sencilla — mantiene comportamiento incluso fuera de React
        try {
          window.history.pushState({}, '', '/suscripciones')
          window.dispatchEvent(new PopStateEvent('popstate'))
        } catch (e) {
          window.location.href = '/suscripciones'
        }
      }
    }

    return Promise.reject(error)
  }
)
