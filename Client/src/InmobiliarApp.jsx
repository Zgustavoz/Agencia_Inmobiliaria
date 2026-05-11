import { Navigate, Route, Routes } from "react-router"
import { LoginPage } from "./App/auth/page/LoginPage"
import { RegisterPage } from "./App/auth/page/RegisterPage"
import { RegisterClientePage } from "./App/auth/page/RegisterClientePage"
import { ClientPage } from "./App/auth/page/ClientPage"
import { ResetPasswordPage } from "./App/auth/page/ResetPasswordPage"
import { Dashboard } from "./App/Gestion-administracion/Dashboard"
import { DashboardPage } from "./App/Gestion-administracion/dashboard/page/Dashboard"
import { UsuarioPage } from "./App/Gestion-administracion/gestion-usuario/page/UsuarioPage"
import { RolPage } from "./App/Gestion-administracion/gestion-rol/page/RolPage"
import { ProtectedRoute } from "./App/auth/components/ProtectedRoute"
import { PublicLayout, NotFoundPage } from "./shared/ui"
import { ClientHomePage } from "./App/Gestion-administracion/home-page/page/ClientHomePage"
import { BitacoraPage } from "./App/Bitacora/page/BitacoraPage"
import { PropiedadPage } from "./App/Gestion-administracion-propiedades/gestion-propiedad/page/PropiedadPage"
import { ContratoPage } from "./App/Gestion-administracion-contratos/gestion-contrato/page/ContratoPage"
import { PropertyMapExample } from "./shared/map/components/PropertyMapExample"
import { BackupsPage } from "./App/Gestion-administracion/gestion-backups/pages/BackupsPage"
import { ClienteSeguimientoPage } from "./App/Gestion-administracion/seguimiento-cliente/page/ClienteSeguimientoPage"
import { VisitasPage } from "./App/modulo-clientes-seguimiento/gestion-visitas/page/VisitasPage"
import { HorariosConfigPage } from "./App/modulo-clientes-seguimiento/gestion-visitas/page/HorariosConfigPage"

function InmobiliarApp() {
  return (
    <Routes>
      {/* ── Rutas públicas ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<ClientHomePage />} />
        <Route
          path="restablecer-password/:uidb64/:token"
          element={<ResetPasswordPage />}
        />

        <Route path="auth">
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-client" element={<RegisterClientePage />} />
        </Route>

        <Route path="client">
          <Route
            index
            element={
              <ProtectedRoute requiredRoles={["Cliente"]}>
                {" "}
                <ClientHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="become-agent"
            element={
              <ProtectedRoute requiredRoles={["Cliente"]}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* ── Dashboard (con Sidebar) ── */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            requiredRoles={["Administrador", "Agente", "empleado"]}
          >
            {" "}
            <Dashboard />{" "}
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute
              requiredRoles={["Administrador", "gestionar usuario"]}
            >
              <UsuarioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute
              requiredRoles={["Administrador", "gestionar roles"]}
            >
              <RolPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bitacora"
          element={
            <ProtectedRoute requiredRoles={["Administrador"]}>
              <BitacoraPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="inmuebles"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Agente"]}>
              <PropiedadPage />
            </ProtectedRoute>
          }
       />

        <Route
          path="/dashboard/contratos"
          element={<ContratoPage />}
        />

        <Route
          path="ver-propiedades"
          element={
            <ProtectedRoute requiredRoles={["Administrador"]}>
              <PropertyMapExample />
            </ProtectedRoute>
          }
        />
        <Route
          path="backups"
          element={
            <ProtectedRoute requiredRoles={["Administrador"]}>
              <BackupsPage />
            </ProtectedRoute>
          }
        />
        <Route path="clientes" element={
            <ProtectedRoute requiredRoles={["Administrador", "Agente"]}>
              <ClienteSeguimientoPage />
            </ProtectedRoute>
          } 
        />

          <Route path="visitas" element={<ProtectedRoute requiredRoles={["Administrador", "Agente"]}><VisitasPage /></ProtectedRoute>} />
          <Route path="horarios-visita" element={<ProtectedRoute requiredRoles={["Administrador", "Agente"]}><HorariosConfigPage /></ProtectedRoute>} />
        {/* <Route path="permisos" element={<ProtectedRoute requiredRoles={["Administrador"]}><PermisoPage /></ProtectedRoute>} /> */}
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default InmobiliarApp
