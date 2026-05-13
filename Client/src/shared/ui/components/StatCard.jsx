import { motion } from "motion/react"

const COLOR_VARIANTS = {
  blue: {
    from: "from-blue-500",
    to: "to-blue-600",
    bgLight: "bg-blue-50",
    textLight: "text-blue-600",
    iconBg: "bg-blue-100"
  },
  green: {
    from: "from-green-500",
    to: "to-green-600",
    bgLight: "bg-green-50",
    textLight: "text-green-600",
    iconBg: "bg-green-100"
  },
  yellow: {
    from: "from-yellow-500",
    to: "to-orange-500",
    bgLight: "bg-yellow-50",
    textLight: "text-yellow-600",
    iconBg: "bg-yellow-100"
  },
  purple: {
    from: "from-purple-500",
    to: "to-pink-500",
    bgLight: "bg-purple-50",
    textLight: "text-purple-600",
    iconBg: "bg-purple-100"
  },
  red: {
    from: "from-red-500",
    to: "to-red-600",
    bgLight: "bg-red-50",
    textLight: "text-red-600",
    iconBg: "bg-red-100"
  },
  indigo: {
    from: "from-indigo-500",
    to: "to-indigo-600",
    bgLight: "bg-indigo-50",
    textLight: "text-indigo-600",
    iconBg: "bg-indigo-100"
  }
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "blue",
  badges = [],
  onClick,
  loading = false 
}) => {
  const colors = COLOR_VARIANTS[color]

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-4 h-full`}>
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                {title}
              </p>
              {loading ? (
                <div className="mt-2 h-8 w-20 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-white mt-1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              )}
              {subtitle && (
                <p className="text-white/70 text-xs mt-1">{subtitle}</p>
              )}
            </div>
            
            <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center backdrop-blur shadow-lg`}>
              <Icon className={`w-6 h-6 ${colors.textLight}`} />
            </div>
          </div>
          
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((badge, idx) => (
                <span 
                  key={idx}
                  className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Borde inferior animado */}
      <div className={`absolute bottom-0 left-0 h-1 ${colors.bgLight} transition-all duration-300 group-hover:w-full`}></div>
    </motion.div>
  )
}