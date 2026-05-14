import React, { useState } from "react";
import { motion } from "motion/react";
import { Bell, Settings, LogOut, Zap, TrendingUp } from "lucide-react";
import { useAuth } from "../../../auth/context/AuthContext";
import { Link } from "react-router";
import VozReporte from "../button/VozReporte";

export const HeaderSaaS = ({ propiedadCount = 0 }) => {
  const { user, logout } = useAuth()
  const tenantInfo = user?.tenant
  const maxPropiedades = tenantInfo?.max_propiedades || 3
  const [showMenu, setShowMenu] = useState(false)
  const usagePercent = ((propiedadCount / maxPropiedades) * 100).toFixed(0)
  const isNearLimit = propiedadCount >= maxPropiedades * 0.8

  const planBadgeColor = (plan) => {
    const colors = {
      profesional: "from-purple-500 to-purple-600",
      basico: "from-gray-500 to-gray-600",
      empresa: "from-amber-500 to-amber-600",
    };
    return colors[plan] || "from-gray-500 to-gray-600";
  };

  const getPlanLabel = (plan) => {
    const labels = {
      'basico': 'Básico',
      'profesional': 'Profesional',
      'empresa': 'Empresa'
    }
    return labels[plan] || 'Básico'
  }

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-gray-200 bg-white sticky top-0 z-30"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Tenant Info + Usage */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Cuenta
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {tenantInfo?.nombre || "Mi Inmobiliaria"}
            </p>
          </div>

          {/* Plan Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-linear-to-r ${planBadgeColor(tenantInfo?.plan)}`}
          >
            {getPlanLabel(tenantInfo?.plan)} Plan
          </motion.div>

          {/* Usage Progress */}
          <div className="flex items-center gap-3">
            <div className="w-48">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600 font-medium">
                  Propiedades
                </label>
                <span
                  className={`text-xs font-semibold ${isNearLimit ? "text-red-600" : "text-gray-600"}`}
                >
                  {propiedadCount}/{maxPropiedades}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  className={`h-2 rounded-full transition-colors ${
                    isNearLimit ? "bg-red-500" : "bg-green-500"
                  }`}
                />
              </div>
            </div>
            {isNearLimit && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded text-red-600 text-xs font-semibold"
              >
                <TrendingUp className="w-3 h-3" />
                Upgrade
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 relative">
          {/* 2. INSERTAMOS EL MICRÓFONO AQUÍ */}
          <div className="flex items-center">
            <VozReporte />
          </div>
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
          >
            <Bell className="w-5 h-5" />
          </motion.button>

          {/* Profile Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.nombres?.[0] || "U"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.nombres}
              </span>
            </motion.button>

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={
                showMenu
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -10, pointerEvents: "none" }
              }
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <Link
                to="/dashboard/settings"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium transition border-b"
              >
                <Settings className="w-4 h-4" />
                Configuración y Suscripción
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium transition w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default HeaderSaaS;
