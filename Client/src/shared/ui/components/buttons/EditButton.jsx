import { Pencil } from "lucide-react"

export const EditButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title="Editar"
    className={`p-2 rounded-lg transition-all duration-200 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer hover:scale-105"
    }`}
  >
    <Pencil size={16} />
  </button>
)