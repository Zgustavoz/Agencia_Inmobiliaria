import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Outlet, useLocation } from "react-router"
import { SuperAdminSidebar } from "./SuperAdminSidebar"
import { HeaderSaaS } from "../../../Gestion-administracion/components/layout/HeaderSaaS"

export const SuperAdminLayout = () => {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex h-screen bg-slate-50">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-slate-100">
        <HeaderSaaS />
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 p-6"
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </main>
    </div>
  )
}
