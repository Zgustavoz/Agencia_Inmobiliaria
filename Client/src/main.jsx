import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './index.css'
import InmobiliarApp from './InmobiliarApp'
import { BrowserRouter } from 'react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// TODO: AGREGAR LA API DE GOOGLE O MAPBOX, INVESTIGAR CUAL ES MEJOR PARA EL AUTOCOMPLETE DE DIRECCIONES Y MAPAS EN GENERAL
// import { APIProvider } from "@vis.gl/react-google-maps";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}> */}
        <InmobiliarApp />
        {/* </APIProvider> */}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
