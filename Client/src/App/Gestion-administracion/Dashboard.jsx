import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Sidebar } from "./components/layout/Sidebar"
import { Outlet, useLocation } from "react-router"

export const Dashboard = () => {
  const location           = useLocation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex h-screen bg-(--surface)">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-(--surface-container-low)">
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </main>
    </div>
  )
}