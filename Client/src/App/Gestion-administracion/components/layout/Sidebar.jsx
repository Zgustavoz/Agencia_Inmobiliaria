import { Link, useLocation } from "react-router"
import {
  LayoutDashboard, Users, Shield, LogOut,
  ChevronRight, Menu, X, Key, ChevronDown, Building2,
  HistoryIcon
} from "lucide-react"
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react"
import { useState, useEffect } from "react"
import { useAuth } from "../../../auth/context/AuthContext"
import { useAuth as useAuthHook } from "../../../auth/hook/useAuthMutation"
import { LogoutButton } from "../button/LogoutButton"
 
export const Sidebar = () => {
  const location           = useLocation()
  const { user, tieneAcceso } = useAuth()
  const { logout }         = useAuthHook()
  const shouldReduceMotion = useReducedMotion()

  const [isOpen,       setIsOpen]       = useState(true)
  const [isMobile,     setIsMobile]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const menuItems = [
    {
      title: "Dashboard",
      path:  "/dashboard",
      icon:  LayoutDashboard,
    },
    {
      title: "Gestión Usuarios",
      icon:  Users,
      key:   "usuarios",
      subItems: [
        { title: "Usuarios", path: "/dashboard/usuarios", icon: Users,  roles: ["Administrador","gestionar usuario"] },
        { title: "Roles",    path: "/dashboard/roles",    icon: Shield, roles: ["Administrador"] },
        { title: "Permisos", path: "/dashboard/permisos", icon: Key,    roles: ["Administrador"] },
        { title: "Bitacora", path: "/dashboard/bitacora", icon: HistoryIcon,    roles: ["Administrador"] },
      ],
    },
    {
      title: "Propiedades",
      icon:  Building2,
      key:   "propiedades",
      subItems: [
        { title: "Inmuebles", path: "/dashboard/inmuebles", icon: Building2, roles: ["Administrador", "Agente"] },
      ],
    },
  ]

  const toggleSubmenu  = (key) => setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }))
  const closeMobile    = () => { if (isMobile) setMobileOpen(false) }
  const isActive       = (path) => location.pathname === path
  const isParentActive = (item) =>
    item.path
      ? location.pathname === item.path
      : item.subItems?.some(s => location.pathname === s.path) ?? false

  const expanded = isMobile ? mobileOpen : isOpen

  return (
    <>
      {isMobile && (
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 bg-(--primary) text-(--on-primary) p-2 rounded-lg shadow-lg"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      <LazyMotion features={domAnimation}>
        <m.div
          animate={{
            width: isMobile
              ? mobileOpen ? 260 : 0
              : isOpen ? 260 : 72,
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeInOut" }}
          className="fixed md:relative bg-(--surface-container-lowest) h-full flex flex-col z-40 border-r border-(--outline-variant)/20 overflow-hidden"
        >

          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-(--outline-variant)/20 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-(--primary) rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-(--on-primary)" />
              </div>
              {expanded && (
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                  <p className="text-sm font-semibold text-(--on-surface) truncate leading-tight">Inmobiliaria</p>
                  <p className="text-xs text-(--on-surface-variant) truncate leading-tight">@{user?.username}</p>
                </m.div>
              )}
            </div>
            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-(--on-surface-variant) hover:text-(--on-surface) transition ml-2 shrink-0"
              >
                <m.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight size={16} />
                </m.div>
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon    = item.icon
              const hasSub  = !!item.subItems
              const active  = isParentActive(item)
              const subOpen = openSubmenus[item.key]

              return (
                <div key={item.title}>
                  {hasSub ? (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.key)}
                      className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-(--primary) text-(--on-primary)"
                          : "text-(--on-surface-variant) hover:bg-(--surface-container) hover:text-(--on-surface)"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {expanded && (
                        <>
                          <span className="ml-3 font-medium flex-1 text-left">{item.title}</span>
                          <m.div animate={{ rotate: subOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                          </m.div>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={closeMobile}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive(item.path)
                          ? "bg-(--primary) text-(--on-primary)"
                          : "text-(--on-surface-variant) hover:bg-(--surface-container) hover:text-(--on-surface)"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {expanded && <span className="ml-3 font-medium">{item.title}</span>}
                    </Link>
                  )}

                  {/* Submenu */}
                  <AnimatePresence initial={false}>
                    {hasSub && subOpen && expanded && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 mt-0.5 mb-0.5 pl-4 border-l border-(--outline-variant)/30 space-y-0.5">
                          {item.subItems.map((sub) => {
                            const SubIcon      = sub.icon
                            const puedeAcceder = tieneAcceso(sub.roles || [])

                            return puedeAcceder ? (
                              <Link
                                key={sub.title}
                                to={sub.path}
                                onClick={closeMobile}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive(sub.path)
                                    ? "bg-(--surface-container) text-(--on-surface) font-medium"
                                    : "text-(--on-surface-variant) hover:bg-(--surface-container-low) hover:text-(--on-surface)"
                                }`}
                              >
                                <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="ml-2.5">{sub.title}</span>
                              </Link>
                            ) : (
                              <div
                                key={sub.title}
                                title="Sin permisos"
                                className="flex items-center px-3 py-2 rounded-lg text-sm text-(--on-surface-variant) opacity-30 cursor-not-allowed"
                              >
                                <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="ml-2.5">{sub.title}</span>
                              </div>
                            )
                          })}
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-2 py-3 border-t border-(--outline-variant)/20 space-y-0.5 shrink-0">
            {expanded && user && (
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                <div className="w-7 h-7 rounded-full bg-(--surface-container-high) border border-(--outline-variant)/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-(--on-surface-variant)">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-(--on-surface) truncate">{user.username}</p>
                  <p className="text-xs text-(--on-surface-variant) truncate">
                    {user.es_admin ? "Administrador" : user.roles?.[0] || "Usuario"}
                  </p>
                </div>
              </div>
            )}

            <LogoutButton/>
          </div>

        </m.div>
      </LazyMotion>
    </>
  )
}