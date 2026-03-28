import { useStore } from "@tanstack/react-form"
import { useFormContext } from ".."


export const BotonSubmitField = ({ children,
  type,
  onClick,
  icon: Icon,
  variant = "primary",
  isLoading,
  className = "" }) => {
  const form = useFormContext()

  const variants = {
    primary: "bg-linear-to-tr from-(--primary) to-(--primary-container) text-white",
    secondary: "bg-(--surface-container-high) text-(--on-surface)",
    danger: "bg-red-600 text-white",
    success: "bg-green-600 text-white"
  }


  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ])
  return (
    <button
      onClick={onClick}
      type={type || "submit"}
      disabled={isSubmitting || !canSubmit}
      className={`flex items-center justify-center gap-2 px-4 py-2 sm:px-6 
      sm:py-3 rounded-xs sm:rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg
      text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {isLoading ? "Cargando..." : children}
    </button>
  )
}
