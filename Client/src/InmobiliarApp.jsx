
import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "./App/auth/page/LoginPage";
import { RegisterPage } from "./App/auth/page/RegisterPage";
import { RegisterClientePage } from "./App/auth/page/RegisterClientePage";
import { ClientPage } from "./App/auth/page/ClientPage";
import { ResetPasswordPage } from "./App/auth/page/ResetPasswordPage";
import { SuscripcionesPage } from "./App/auth/page/SuscripcionesPage";
import { Dashboard } from "./App/Gestion-administracion/Dashboard";
import { DashboardPage } from "./App/Gestion-administracion/dashboard/page/Dashboard";
import { SettingsPage } from "./App/Gestion-administracion/settings/page/SettingsPage";
import { AsignarAgentesPage } from "./App/Gestion-administracion/asignar-agentes/page/AsignarAgentesPage";
import { UsuarioPage } from "./App/Gestion-administracion/gestion-usuario/page/UsuarioPage";
import { RolPage } from "./App/Gestion-administracion/gestion-rol/page/RolPage";
import { ProtectedRoute } from "./App/auth/components/ProtectedRoute";
import { PublicLayout, NotFoundPage } from "./shared/ui";
import { ClientHomePage } from "./App/Gestion-administracion/home-page/page/ClientHomePage";
import { BitacoraPage } from "./App/Bitacora/page/BitacoraPage";
import { PropiedadPage } from "./App/Gestion-administracion-propiedades/gestion-propiedad/page/PropiedadPage";
import { PropertyMapExample } from "./shared/map/components/PropertyMapExample";
import { BackupsPage } from "./App/Gestion-administracion/gestion-backups/pages/BackupsPage";
import { ClienteSeguimientoPage } from "./App/Gestion-administracion/seguimiento-cliente/page/ClienteSeguimientoPage";
import { VisitasPage } from "./App/modulo-clientes-seguimiento/gestion-visitas/page/VisitasPage";
import { HorariosConfigPage } from "./App/modulo-clientes-seguimiento/gestion-visitas/page/HorariosConfigPage";
import { ClientesHistorialPage } from "./App/modulo-clientes-seguimiento/gestion-visitas/page/ClientesHistorialPage";
import { VencimientosPage } from "./App/Gestion-administracion/gestion-vencimientos/page/VencimientosPage";
import { ContratoPage } from "./App/Gestion-administracion-contratos/gestion-contrato/page/ContratoPage";

// --- IMPORTACIONES SUPERADMIN ---
import { SuperAdminLayout } from "./App/SuperAdmin/components/layout/SuperAdminLayout";
import { SuperAdminDashboard } from "./App/SuperAdmin/pages/SuperAdminDashboard";
import { TenantListPage } from "./App/SuperAdmin/pages/TenantListPage";
import { ProvisionTenantPage } from "./App/SuperAdmin/pages/ProvisionTenantPage";

function InmobiliarApp() {
  return (
    <Routes>
      {/* ── Rutas públicas ── */}
      <Route element={<PublicLayout />}>
        <Route path="suscripciones" element={<SuscripcionesPage />} />
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

      {/* ── Dashboard Inmobiliaria (con Sidebar estándar) ── */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            requiredRoles={["Administrador", "Supervisor", "Agente", "Asistente", "Auditor"]}
          >
            {" "}
            <Dashboard />{" "}
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* ... (resto de rutas del dashboard se mantienen igual) ... */}
        <Route
          path="settings"
          element={
            <ProtectedRoute
              requiredRoles={["Administrador", "Supervisor", "Agente", "Asistente", "Auditor"]}
            >
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="asignar-agentes"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor"]}>
              <AsignarAgentesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute
              requiredRoles={["Administrador"]}
            >
              <UsuarioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute
              requiredRoles={["Administrador"]}
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
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Auditor"]}>
              <PropiedadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/contratos"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Auditor"]}>
              <ContratoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="ver-propiedades"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Asistente", "Auditor"]}>
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
        <Route
          path="clientes"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Asistente", "Auditor"]}>
              <ClienteSeguimientoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="vencimientos"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Auditor"]}>
              <VencimientosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="visitas"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Asistente", "Auditor"]}>
              <VisitasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="horarios-visita"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Agente", "Asistente"]}>
              <HorariosConfigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clientes-historial"
          element={
            <ProtectedRoute requiredRoles={["Administrador", "Supervisor", "Auditor"]}>
              <ClientesHistorialPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Dashboard SUPERADMIN (Acceso Global) ── */}
      <Route
        path="superadmin"
        element={
          <ProtectedRoute
            requiredRoles={["Superadmin"]}
          >
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="tenants" element={<TenantListPage />} />
        <Route path="provisionar" element={<ProvisionTenantPage />} />
        <Route path="stats" element={<div className="p-4">Estadísticas Detalladas (En desarrollo...)</div>} />
        <Route path="settings" element={<div className="p-4">Configuración Global (En desarrollo...)</div>} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


export default InmobiliarApp;
