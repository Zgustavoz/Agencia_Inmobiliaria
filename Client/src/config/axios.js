import axios from "axios"

export const intanciaAxios = axios.create({
  baseURL:         import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000",
  withCredentials: true,
})


intanciaAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/")
    ) {
      originalRequest._retry = true

      try {
        await intanciaAxios.post("/gestion_usuarios/auth/refresh/")
        return intanciaAxios(originalRequest)
      } catch {
        // window.location.href = "/auth"
      }
    }

    return Promise.reject(error)
  }
)