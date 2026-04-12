import { Pencil } from "lucide-react"

export const EditButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title="Editar"
    className={`p-2 rounded-lg transition-colors ${
      disabled
        ? "text-(--on-surface-variant) opacity-30 cursor-not-allowed"
        : "text-(--on-surface-variant) hover:bg-(--secondary-container) hover:text-(--on-secondary-container) cursor-pointer"
    }`}
  >
    <Pencil size={15} />
  </button>
)