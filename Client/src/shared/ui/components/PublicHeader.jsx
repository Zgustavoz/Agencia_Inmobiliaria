import { motion } from "motion/react"
import { Building2 } from "lucide-react"
import { Link, NavLink } from "react-router"

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/auth", label: "Ingresar" },
  { to: "/auth/register-client", label: "Registro" },
]

export const PublicHeader = () => {
  const MotionHeader = motion.header

  return (
    <MotionHeader
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-(--outline-variant)/30 bg-(--surface-container-lowest)/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="rounded-md bg-(--primary-fixed) p-2 text-(--primary)">
            <Building2 size={16} />
          </span>
          <span className="font-display text-sm md:text-lg font-extrabold tracking-tight text-(--on-surface) text-wrap">
            Inmobiliaria Manager
          </span>
        </Link>

        <nav className="flex items-center gap-6">
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
        </nav>
      </div>
    </MotionHeader>
  )
}
