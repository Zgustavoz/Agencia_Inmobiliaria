import { motion } from "motion/react"
import { Building2 } from "lucide-react"
import { useState } from "react"
import { Link, NavLink } from "react-router"
import { LoginModal } from "./LoginModal"

const navLinks = [
  { to: "/client", label: "Inicio" },
]

export const PublicHeader = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const MotionHeader = motion.header

  return (
    <MotionHeader
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-(--outline-variant)/30 bg-(--surface-container-lowest)/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/client" className="inline-flex items-center gap-2">
          <span className="rounded-md bg-(--primary-fixed) p-2 text-(--primary)">
            <Building2 size={16} />
          </span>
          <span className="font-display text-sm md:text-lg font-extrabold tracking-tight text-(--on-surface) text-wrap">
            Inmobiliaria Manager
          </span>
        </Link>

        <nav className="flex items-center gap-3 md:gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-(--primary)" : "text-(--on-surface-variant) hover:text-(--on-surface)"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-(--on-primary) transition hover:brightness-95"
          >
            Ingresar
          </button>
        </nav>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </MotionHeader>
  )
}
