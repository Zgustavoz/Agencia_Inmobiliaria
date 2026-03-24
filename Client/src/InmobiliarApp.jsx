import { Route, Routes } from "react-router"
import { UsuarioPage } from "./App/Gestion-administracion/gestion-usuario/page/UsuarioPage"

function InmobiliarApp() {


  return (
    <Routes>
      {/* ruta principal, para la pagina de incio para la web */}
      <Route>
      </Route>
      {/* ruta para el auth, como login o registro */}
      <Route>
      </Route>
      {/* ruta para el dashboard (opcional) */}
      <Route>
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
    </Routes>
  )
}

export default InmobiliarApp