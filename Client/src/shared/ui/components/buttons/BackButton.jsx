import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

export const BackButton = ({ fallback = "/" , children = "Volver", className = "" }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1)   // vuelve a la página anterior
    } else {
      navigate(fallback) // si no hay historial, va al fallback
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 border border-(--outline-variant)/40 text-(--on-surface-variant) rounded-xl text-sm font-medium hover:bg-(--surface-container) transition ${className}`}
    >
      <ArrowLeft size={16} />
      {children}
    </button>
  )
}