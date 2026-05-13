import { ToggleLeft, ToggleRight } from "lucide-react"

export const EstadoButton = ({ onClick, disabled, activo }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title={activo ? "Desactivar" : "Activar"}
    className={`p-2 rounded-lg transition-all duration-200 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        : activo
          ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer hover:scale-105"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer hover:scale-105"
    }`}
  >
    {activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
  </button>
)