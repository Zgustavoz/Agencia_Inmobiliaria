import { useQuery } from "@tanstack/react-query"
import { listarBitacora } from "../api/bitacoraApi"
import { BitacoraTable } from "../components/BitacoraTable"

export const BitacoraPage = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["bitacora"],
    queryFn: listarBitacora
  })

  if (isLoading) return <div>Cargando bitácora...</div>
  if (error) return <div>Error al cargar datos</div>

  return (
    <main className="min-h-screen bg-(--surface) px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Pasamos 'logs' que ahora viene del backend */}
        <BitacoraTable logs={logs || []} />
      </div>
    </main>
  )
}