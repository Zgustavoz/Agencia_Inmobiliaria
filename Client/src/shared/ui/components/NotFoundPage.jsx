import { motion } from "motion/react"
import { Home, SearchX, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"
import { BackButton } from "./buttons/index"

export const NotFoundPage = () => {
  const MotionDiv = motion.div
  const navigate = useNavigate()
  return (
    <main className="min-h-screen flex items-center justify-center bg-(--surface) px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-(--surface-container) flex items-center justify-center">
            <SearchX className="w-10 h-10 text-(--on-surface-variant)" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold text-(--primary)">404</h1>
          <h2 className="text-xl font-semibold text-(--on-surface)">Página no encontrada</h2>
          <p className="text-sm text-(--on-surface-variant)">
            La página que buscas no existe o fue movida.
          </p>
        </div>
        {/* Botón Volver con historial */}
        <BackButton/>
      </MotionDiv>
    </main>
  )
}