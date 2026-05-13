import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Sidebar } from "./components/layout/Sidebar"
import { HeaderSaaS } from "./components/layout/HeaderSaaS"
import { Outlet, useLocation } from "react-router"

export const Dashboard = () => {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  // Mock tenant data - en producción vendrá de context/API
  const tenantInfo = {
    nombre: 'Mi Inmobiliaria Pro',
    plan: 'Pro',
  }

  return (
    <div className="flex h-screen bg-(--surface)">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-(--surface-container-low)">
        <HeaderSaaS tenantInfo={tenantInfo} propiedadCount={3} maxPropiedades={3} />
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </main>
    </div>
  )
}