import { useEffect, useState } from "react"
import {
  Calendar as CalendarIcon,
  FileSearch,
  Lock,
  Search,
  ShieldAlert,
  X,
  History,
  Building2
} from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { listarBitacoraGlobal, verificarClaveBitacoraGlobal } from "../api/globalBitacoraApi"
import { BitacoraTable } from "../../Bitacora/components/BitacoraTable"

const BITACORA_GLOBAL_STORAGE_KEY = "bitacora_global_access_granted"

export const GlobalBitacoraPage = () => {
  const [password, setPassword] = useState("")
  const [mensajeError, setMensajeError] = useState("")
  const [search, setSearch] = useState("")
  const [moduloFiltro, setModuloFiltro] = useState("")
  const [desbloqueada, setDesbloqueada] = useState(
    () => sessionStorage.getItem(BITACORA_GLOBAL_STORAGE_KEY) === "true"
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bitacora-global"],
    queryFn: listarBitacoraGlobal,
    enabled: desbloqueada,
    retry: false,
  })

  const verificarClave = useMutation({
    mutationFn: verificarClaveBitacoraGlobal,
    onSuccess: async () => {
      sessionStorage.setItem(BITACORA_GLOBAL_STORAGE_KEY, "true")
      setDesbloqueada(true)
      setMensajeError("")
      setPassword("")
      await refetch()
    },
    onError: (mutationError) => {
      setMensajeError(mutationError.response?.data?.error || "Contraseña incorrecta")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    verificarClave.mutate(password)
  }

  if (!desbloqueada) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso a Bitácora Global</h2>
          <p className="text-sm text-slate-500 mb-6">Esta área contiene registros de todos los tenants. Ingresa la clave maestra para continuar.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="password" 
              placeholder="Contraseña de seguridad"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mensajeError && <p className="text-xs font-bold text-rose-600 bg-rose-50 py-2 rounded-lg">{mensajeError}</p>}
            <button 
              disabled={verificarClave.isPending}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {verificarClave.isPending ? "Verificando..." : "Desbloquear Registros"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const logs = Array.isArray(data) ? data : (data?.results || [])

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Bitácora Global del Sistema
          </h1>
          <p className="text-slate-500 text-sm italic">Auditoría completa de movimientos en todos los tenants.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar por usuario o detalle..."
               className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400 font-medium">Cargando bitácora global...</div>
        ) : (
          <BitacoraTable logs={logs.filter(log => 
            log.usuario_nombre?.toLowerCase().includes(search.toLowerCase()) || 
            log.detalle?.toLowerCase().includes(search.toLowerCase())
          )} />
        )}
      </div>
    </div>
  )
}
