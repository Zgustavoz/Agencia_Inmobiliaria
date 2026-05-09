import { Plus } from "lucide-react"

export const CreateButton = ({ onClick, disabled, children = "Nuevo" }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer hover:scale-105"
    }`}
  >
    <Plus size={16} />
    {children}
  </button>
)