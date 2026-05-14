import { useEffect } from "react"
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { Outlet, useLocation, useSearchParams } from "react-router"
import { Sidebar } from "./components/layout/Sidebar"
import { HeaderSaaS } from "./components/layout/HeaderSaaS"
import { useAuth } from "../auth/context/AuthContext"

export const Dashboard = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const { refreshUser } = useAuth()

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return

    refreshUser().finally(() => {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete("payment")
      setSearchParams(nextParams, { replace: true })
    })
  }, [refreshUser, searchParams, setSearchParams])

  return (
    <div className="flex h-screen bg-(--surface)">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-(--surface-container-low)">
        <HeaderSaaS propiedadCount={3} />
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
