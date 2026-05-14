import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Check, AlertCircle, Zap, Crown, ArrowRight } from 'lucide-react'
import { intanciaAxios } from '../../../config/axios'

export const SuscripcionesPage = () => {
  const navigate = useNavigate()
  const [hoveredPlan, setHoveredPlan] = useState(null)

  const handleUpgrade = async (planId) => {
    try {
      const { data } = await intanciaAxios.post("/api/pagos/checkout/", { plan_id: planId })
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error)
      alert("Hubo un error al procesar el pago. Por favor intenta de nuevo.")
    }
  }

  const planes = [
    {
      id: 'basic',
      nombre: 'Básico',
      descripcion: 'Perfecto para comenzar',
      precio: 'Gratis',
      periodo: 'para siempre',
      features: [
        'Máx. 3 propiedades',
        'Soporte por email',
        'Reportes básicos',
        'Acceso a 1 usuario',
      ],
      icon: AlertCircle,
      btnTexto: 'Volver al Dashboard',
      btnAccion: () => navigate('/dashboard'),
      highlight: false,
    },
    {
      id: 'pro',
      nombre: 'Pro',
      descripcion: 'Para agencias en crecimiento',
      precio: '$29',
      periodo: 'por mes',
      features: [
        'Máx. 50 propiedades',
        'Soporte prioritario',
        'Reportes avanzados',
        'Acceso a 5 usuarios',
        'API integrada',
      ],
      icon: Zap,
      btnTexto: 'Actualizar a Pro',
      btnAccion: () => handleUpgrade('pro'),
      highlight: true,
    },
    {
      id: 'enterprise',
      nombre: 'Enterprise',
      descripcion: 'Solución personalizada',
      precio: 'Custom',
      periodo: 'según tus necesidades',
      features: [
        'Propiedades ilimitadas',
        'Soporte 24/7 dedicado',
        'Reportes personalizados',
        'Usuarios ilimitados',
        'Integraciones custom',
      ],
      icon: Crown,
      btnTexto: 'Actualizar a Enterprise',
      btnAccion: () => handleUpgrade('enterprise'),
      highlight: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Límite de Plan Alcanzado
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4">
          Tu suscripción actual ha alcanzado el máximo de recursos permitidos. Elige un plan superior para continuar
          utilizando nuestro servicio sin limitaciones.
        </p>
      </motion.div>

      {/* Planes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        {planes.map((plan) => {
          const Icon = plan.icon
          return (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${plan.highlight
                ? 'md:scale-105 shadow-2xl border-2 border-purple-400'
                : 'border border-gray-700'
                } ${hoveredPlan === plan.id ? 'shadow-xl' : ''}`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 ${plan.highlight
                  ? 'bg-linear-to-br from-purple-600 to-purple-800'
                  : 'bg-linear-to-br from-gray-800 to-gray-900'
                  }`}
              />

              {/* Badge destacado */}
              {plan.highlight && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute -top-1 -right-4 bg-linear-to-r from-amber-400 to-orange-500 px-6 py-2 rounded-full text-sm font-bold text-gray-900 transform rotate-12"
                >
                  Más Popular
                </motion.div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon y título */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 20, scale: 1.1 }}
                    className={`p-3 rounded-lg ${plan.highlight ? 'bg-purple-500/30' : 'bg-gray-700/50'
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${plan.highlight ? 'text-amber-300' : 'text-gray-300'}`} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.nombre}</h3>
                    <p className={`text-sm ${plan.highlight ? 'text-purple-200' : 'text-gray-400'}`}>
                      {plan.descripcion}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{plan.precio}</span>
                    <span className="text-sm text-gray-400">{plan.periodo}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 grow">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 text-gray-200"
                    >
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Botón */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={plan.btnAccion}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${plan.highlight
                    ? 'bg-linear-to-r from-amber-400 to-orange-500 text-gray-900 hover:from-amber-300 hover:to-orange-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  {plan.btnTexto}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-gray-400 mb-4">¿Preguntas sobre los planes?</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          Contactar soporte
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  )
}

export default SuscripcionesPage
