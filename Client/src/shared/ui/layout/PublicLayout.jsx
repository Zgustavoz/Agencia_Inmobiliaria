import { Outlet, useLocation } from "react-router"
import { PublicHeader } from "../components/PublicHeader"

const adminPathPatterns = ["/admin", "/gestion-administracion", "/dashboard"]

export const PublicLayout = () => {
  const location = useLocation()
  const isAdminSection = adminPathPatterns.some((path) => location.pathname.startsWith(path))

  if (isAdminSection) {
    return <Outlet />
  }

  return (
    <>
      <PublicHeader />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  )
}
