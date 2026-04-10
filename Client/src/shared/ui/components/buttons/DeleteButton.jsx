import { Trash2 } from "lucide-react"

export const DeleteButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title="Eliminar"
    className={`p-2 rounded-lg transition-colors ${
      disabled
        ? "text-(--on-surface-variant) opacity-30 cursor-not-allowed"
        : "text-(--on-surface-variant) hover:bg-(--error-container) hover:text-(--on-error-container) cursor-pointer"
    }`}
  >
    <Trash2 size={15} />
  </button>
)