import { Plus } from "lucide-react"

export const CreateButton = ({ onClick, disabled, children = "Nuevo" }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      disabled
        ? "bg-(--surface-container) text-(--on-surface-variant) opacity-40 cursor-not-allowed"
        : "bg-(--primary) text-(--on-primary) hover:bg-(--primary)/90 cursor-pointer"
    }`}
  >
    <Plus size={15} />
    {children}
  </button>
)