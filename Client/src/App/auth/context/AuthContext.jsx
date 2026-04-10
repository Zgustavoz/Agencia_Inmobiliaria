import { createContext, useContext, useState, useEffect } from "react"
import { obtenerPerfil } from "../api/authApi"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  const construirUsuario = (perfil) => ({
    id:        perfil.id,
    username:  perfil.username,
    email:     perfil.email,
    nombres:   perfil.nombres,
    apellidos: perfil.apellidos,
    roles:     perfil.roles_info?.map(r => r.nombre) || [],
    permisos:  perfil.permisos || [],
    permisos_codigos: perfil.permisos_codigos || [],
    es_admin:  perfil.es_admin,
    es_online: perfil.es_online,
    foto_url:  perfil.foto_url,
  })

  useEffect(() => {
    obtenerPerfil()
      .then((perfil) => setUser(construirUsuario(perfil)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login  = (perfil) => setUser(construirUsuario(perfil))
  const logout = () => setUser(null)

  const tieneAcceso = (rolesRequeridos = []) => {
    if (user?.es_admin) return true
    if (!rolesRequeridos.length) return true
    return rolesRequeridos.some(rol => user?.roles?.includes(rol))
  }

  const tienePermiso = (codigo) => {
    if (user?.es_admin) return true
    return user?.permisos_codigos?.includes(codigo) || false
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, tieneAcceso, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)