import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  Activity,
  History,
  Database
} from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/context/AuthContext";
import { LogoutButton } from "../../../Gestion-administracion/components/button/LogoutButton";

export const SuperAdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      title: "Panel Global",
      path: "/superadmin",
      icon: LayoutDashboard,
    },
    {
      title: "Gestionar Tenants",
      path: "/superadmin/tenants",
      icon: Building2,
    },
    {
        title: "Nuevo Registro",
        path: "/superadmin/provisionar",
        icon: PlusCircle,
    },
    {
        title: "Bitácora Global",
        path: "/superadmin/bitacora",
        icon: History,
    },
    {
        title: "Backups Sistema",
        path: "/superadmin/backups",
        icon: Database,
    },
    {
      title: "Estadísticas",
      path: "/superadmin/stats",
      icon: Activity,
    },
    {
        title: "Configuración",
        path: "/superadmin/settings",
        icon: Settings,
    }
  ];

  const closeMobile = () => {
    if (isMobile) setMobileOpen(false);
  };
  const isActive = (path) => location.pathname === path;

  const expanded = isMobile ? mobileOpen : isOpen;

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
            width: isMobile ? (mobileOpen ? 260 : 0) : isOpen ? 260 : 72,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: "easeInOut",
          }}
          className="fixed md:relative bg-(--surface-container-lowest) h-full flex flex-col z-40 border-r border-(--outline-variant)/20 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-(--outline-variant)/20 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              {expanded && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="text-sm font-bold text-(--on-surface) truncate leading-tight uppercase tracking-wider">
                    SuperAdmin
                  </p>
                  <p className="text-xs text-indigo-500 font-medium truncate leading-tight">
                    Global Manager
                  </p>
                </m.div>
              )}
            </div>
            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-(--on-surface-variant) hover:text-(--on-surface) transition ml-2 shrink-0"
              >
                <m.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} />
                </m.div>
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  onClick={closeMobile}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.path)
                    ? "bg-indigo-600 text-white"
                    : "text-(--on-surface-variant) hover:bg-(--surface-container) hover:text-(--on-surface)"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {expanded && (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-2 py-3 border-t border-(--outline-variant)/20 space-y-0.5 shrink-0">
            {expanded && user && (
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-700">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-(--on-surface) truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-indigo-600 font-bold truncate">
                    PLATFORM ADMIN
                  </p>
                </div>
              </div>
            )}

            <LogoutButton />
          </div>
        </m.div>
      </LazyMotion>
    </>
  );
};
