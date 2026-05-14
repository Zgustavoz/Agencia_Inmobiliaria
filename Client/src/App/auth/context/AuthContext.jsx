import { createContext, useContext, useState, useEffect } from "react"
import { obtenerPerfil } from "../api/authApi"
import {
  getPrimaryRole,
  normalizeRoles,
  userHasAccess,
  userHasPermission,
} from "../config/authorization"

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
    roles:     normalizeRoles(perfil.roles_info?.map(r => r.nombre) || []),
    rol_principal: getPrimaryRole(perfil.roles_info?.map(r => r.nombre) || []),
    permisos:  perfil.permisos || [],
    permisos_codigos: perfil.permisos_codigos || [],
    es_admin:  perfil.es_admin,
    es_online: perfil.es_online,
    foto_url:  perfil.foto_url,
    // Multi-tenant: información de la inmobiliaria/tenant
    tenant:    perfil.tenant || null,
  })

  useEffect(() => {
    obtenerPerfil()
      .then((perfil) => setUser(construirUsuario(perfil)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login  = (perfil) => setUser(construirUsuario(perfil))
  const logout = () => setUser(null)
  
  const refreshUser = async () => {
    try {
      const perfil = await obtenerPerfil()
      setUser(construirUsuario(perfil))
    } catch (e) {
      setUser(null)
    }
  }

  const tieneAcceso = (rolesRequeridos = []) => userHasAccess(user, rolesRequeridos)

  const tienePermiso = (rolOModulo, codigo = null) =>
    userHasPermission(user, rolOModulo, codigo)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, tieneAcceso, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
