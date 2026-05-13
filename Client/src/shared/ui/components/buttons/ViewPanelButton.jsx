import { LayoutDashboard } from "lucide-react"

export const ViewPanelButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title="Panel de seguimiento"
    className={`p-2 rounded-lg transition-all duration-200 ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer hover:scale-105"
    }`}
  >
    <LayoutDashboard size={16} />
  </button>
)