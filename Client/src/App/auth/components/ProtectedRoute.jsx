import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { Loading } from "../../../shared/ui/components/Loading"
import { UnauthorizedPage } from "../../../shared/ui/components/UnauthorizedPage"

export const ProtectedRoute = ({
  children,
  requiredPermission = null,
  requiredRoles      = [],
}) => {
  const { user, loading, tienePermiso, tieneAcceso } = useAuth()

  if (loading) return <Loading />
  if (!user)   return <Navigate to="/" replace />
  if (user.es_admin) return children

  if (requiredPermission && !tienePermiso(requiredPermission))
    return <UnauthorizedPage />

  if (requiredRoles.length > 0 && !tieneAcceso(requiredRoles))
    return <UnauthorizedPage />


  return children
}