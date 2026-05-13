import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Settings, CreditCard, Zap, Calendar, ArrowRight, CheckCircle, AlertCircle, Download, X } from 'lucide-react'

import { Link } from 'react-router'
import { useAuth } from '../../../auth/context/AuthContext'

export const SettingsPage = () => {
  const { user, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showChangePlanModal, setShowChangePlanModal] = useState(false)
  const [showInvoicesModal, setShowInvoicesModal] = useState(false)

  // Mock subscription data
  const subscriptionData = {
    plan: 'Pro',
    status: 'activo',
    price: '$29',
    period: 'mes',
    nextBillingDate: '15 de Junio, 2026',
    startDate: '15 de Mayo, 2025',
    maxPropiedades: 3,
    currentPropiedades: 3,
    features: [
      'Máx. 3 propiedades',
      'Soporte prioritario',
      'Reportes avanzados',
      'Acceso a 5 usuarios',
      'API integrada',
    ],
  }

  // Mock plans for upgrade
  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: '0',
      period: 'mes',
      description: 'Perfecto para comenzar',
      features: ['Hasta 3 propiedades', 'Soporte por email', 'Reportes básicos', '1 usuario'],
      current: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '29',
      period: 'mes',
      description: 'Lo más popular',
      features: ['Hasta 50 propiedades', 'Soporte prioritario', 'Reportes avanzados', '5 usuarios', 'API integrada'],
      current: true,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Personalizado',
      period: 'consulta',
      description: 'Para grandes equipos',
      features: ['Propiedades ilimitadas', 'Soporte 24/7', 'Análisis avanzado', 'Usuarios ilimitados', 'Integraciones custom'],
      current: false,
    },
  ]

  // Mock invoices
  const invoices = [
    {
      id: 'INV-2026-005',
      date: '15 de Mayo, 2026',
      amount: '$29.00',
      status: 'pagado',
      period: 'Mayo 2026',
    },
    {
      id: 'INV-2026-004',
      date: '15 de Abril, 2026',
      amount: '$29.00',
      status: 'pagado',
      period: 'Abril 2026',
    },
    {
      id: 'INV-2026-003',
      date: '15 de Marzo, 2026',
      amount: '$29.00',
      status: 'pagado',
      period: 'Marzo 2026',
    },
    {
      id: 'INV-2026-002',
      date: '15 de Febrero, 2026',
      amount: '$29.00',
      status: 'pagado',
      period: 'Febrero 2026',
    },
    {
      id: 'INV-2026-001',
      date: '15 de Enero, 2026',
      amount: '$29.00',
      status: 'pagado',
      period: 'Enero 2026',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            Configuración y Suscripción
          </h1>
          <p className="text-gray-600">Gestiona tu plan, facturación y preferencias</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Current Plan Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
          >
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold opacity-90 mb-1">Plan Actual</p>
                  <h2 className="text-3xl font-bold">{subscriptionData.plan}</h2>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-white/20 rounded-lg"
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm opacity-90">Precio</p>
                  <p className="text-2xl font-bold">{subscriptionData.price} <span className="text-lg">/ {subscriptionData.period}</span></p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Estado</p>
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    Activo
                  </p>
                </div>
              </div>

              <div className="text-sm opacity-90">
                <p>Próxima facturación: <span className="font-semibold">{subscriptionData.nextBillingDate}</span></p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Qué incluye este plan</h3>
              <ul className="space-y-3 mb-6">
                {subscriptionData.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowChangePlanModal(true)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Cambiar Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInvoicesModal(true)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Ver Facturación
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Usage Stats */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Uso del Plan</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Propiedades</label>
                  <span className="text-sm font-semibold text-gray-600">
                    {subscriptionData.currentPropiedades} de {subscriptionData.maxPropiedades}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(subscriptionData.currentPropiedades / subscriptionData.maxPropiedades) * 100}%` }}
                    className="h-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full"
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Te quedan <span className="font-semibold">{subscriptionData.maxPropiedades - subscriptionData.currentPropiedades}</span> espacios disponibles
                </p>
              </div>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Información de Cuenta</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Nombre Completo</label>
                <p className="text-gray-900 font-medium">{user?.nombres} {user?.apellidos}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Usuario</label>
                <p className="text-gray-900 font-medium">@{user?.username}</p>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            variants={itemVariants}
            className="bg-red-50 rounded-xl border-2 border-red-200 p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Zona de Peligro</h3>
                <p className="text-red-800 text-sm mb-4">
                  Estas acciones son permanentes y no pueden deshacerse.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Cancelar Suscripción
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 text-center"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Necesitas Ayuda?</h3>
            <p className="text-gray-600 mb-4">Nuestro equipo de soporte está disponible 24/7</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition inline-flex items-center gap-2"
            >
              Contactar Soporte
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowChangePlanModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Cambiar Plan</h3>
              <button
                onClick={() => setShowChangePlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative border-2 rounded-xl p-6 transition ${plan.current
                    ? 'border-blue-500 bg-blue-50'
                    : plan.popular
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                      Más Popular
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      Plan Actual
                    </div>
                  )}

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/ {plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={plan.current}
                    onClick={() => {
                      alert(`Cambio a plan ${plan.name} procesado`)
                      setShowChangePlanModal(false)
                    }}
                    className={`w-full py-2 rounded-lg font-semibold transition ${plan.current
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {plan.current ? 'Plan Actual' : 'Seleccionar'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Invoices Modal */}
      {showInvoicesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInvoicesModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Historial de Facturas</h3>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice, idx) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.period}</p>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-bold text-gray-900">{invoice.amount}</p>
                    <p className={`text-xs font-semibold ${invoice.status === 'pagado' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                      {invoice.status === 'pagado' ? '✓ Pagado' : 'Pendiente'}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert(`Descargando ${invoice.id}...`)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                ¿No encuentras una factura? <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Contacta a soporte</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Cancelar Suscripción</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro? Perderás acceso a todas las funciones premium.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Suscripción cancelada')
                  setShowDeleteModal(false)
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Cancelar Plan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SettingsPage
