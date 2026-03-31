import { Navigate, Route, Routes } from "react-router"
import { UsuarioPage } from "./App/Gestion-administracion/gestion-usuario/page/UsuarioPage"
import { LoginPage } from "./App/auth/page/LoginPage"
import { RegisterPage } from "./App/auth/page/RegisterPage"
import { PublicLayout } from "./shared/ui"
import { RegisterClientePage } from "./App/auth/page/RegisterClientePage"
import { ClientPage } from "./App/auth/page/ClientPage"

function InmobiliarApp() {


  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* ruta principal, para la pagina de incio para la web */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* ruta para el auth, como login o registro */}
        <Route path="auth">
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-client" element={<RegisterClientePage />} />
        </Route>

        {/* ruta para el dashboard (opcional) */}
        <Route>
        </Route>

        {/* Rutas para los clientes  */}
        <Route path="client">
          <Route index element={<ClientPage />} />
          <Route path="become-agent" element={<RegisterPage />} />
        </Route>

        {/* el resto para los modulos, esto se construirá avanzando con el tiempo */}

        {/* ejemplo de como ocupar rutas */}
        <Route path="pruebas">
          <Route path="test1" element={<div> ESTO ES UN TEST DE COMO OCUPAR LAS ROUTE DE REACT-ROUTER</div>} />
          {/* para acceder a esta ruta seria http://localhost:5173/pruebas/test2 */}
          <Route path="test2" element={<UsuarioPage />} />
        </Route>

        {/* ruta para la pagina de error 404 */}
        <Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default InmobiliarApp