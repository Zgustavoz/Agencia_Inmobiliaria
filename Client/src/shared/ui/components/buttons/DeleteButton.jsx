import { Trash2 } from "lucide-react"

export const DeleteButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title="Eliminar"
    className={`p-2 rounded-lg transition-all duration-200 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        : "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer hover:scale-105"
    }`}
  >
    <Trash2 size={16} />
  </button>
)