import { ToggleLeft, ToggleRight } from "lucide-react"

export const EstadoButton = ({ onClick, disabled, activo }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title={activo ? "Desactivar" : "Activar"}
    className={`p-2 rounded-lg transition-colors ${
      disabled
        ? "text-(--on-surface-variant) opacity-30 cursor-not-allowed"
        : activo
          ? "text-(--tertiary) hover:bg-(--tertiary-container) hover:text-(--on-tertiary-container) cursor-pointer"
          : "text-(--on-surface-variant) hover:bg-(--surface-container) cursor-pointer"
    }`}
  >
    {activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
  </button>
)