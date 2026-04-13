import { useAuth as useAuthHook } from "../../../auth/hook/useAuthMutation"
import { LogOut } from "lucide-react"
import { m } from "motion/react"
// import { useAuth as useAuthHook } from "../../auth/hook/useAuthMutation"

export const LogoutButton = ({ expanded = true }) => {

  const { logout } = useAuthHook()

  return (
    <m.button
      type="button"
      onClick={() => logout()}

      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}

      className="
        flex items-center w-full
        px-3 py-2.5 rounded-lg text-sm
        text-red-500
        hover:bg-red-500/10
        hover:text-red-600
        transition-all duration-200
        group
      "
    >

      {/* Icon animado */}
      <m.div
        className="shrink-0"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
      >
        <LogOut className="w-4 h-4" />
      </m.div>

      {expanded && (
        <span className="ml-3 font-medium">
          Cerrar sesión
        </span>
      )}

    </m.button>
  )
}