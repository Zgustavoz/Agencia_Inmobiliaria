import { motion } from "motion/react"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, ShieldOff } from "lucide-react"
import { BackButton } from "./buttons/index"


export const UnauthorizedPage = () => {
  const MotionDiv = motion.div
  const navigate  = useNavigate()

  return (
    <main className="min-h-screen flex items-center justify-center bg-(--surface) px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-(--error-container) flex items-center justify-center">
            <ShieldOff className="w-10 h-10 text-(--on-error-container)" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold text-(--error)">403</h1>
          <h2 className="text-xl font-semibold text-(--on-surface)">Acceso denegado</h2>
          <p className="text-sm text-(--on-surface-variant)">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
        <BackButton/>
 
        </div>
      </MotionDiv>
    </main>
  )
}