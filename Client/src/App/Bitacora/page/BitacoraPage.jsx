import { BitacoraTable } from "../components/BitacoraTable"

export const BitacoraPage = () => {
  // datos de prueba
  const logs = [
    {
      fecha: "2026-03-29",
      hora: "10:03",
      usuario: "admin",
      detalle: "Inicio de sesión",
      ip: "192.168.0.1",
    },
    {
      fecha: "2026-03-29",
      hora: "11:00",
      usuario: "user01",
      detalle: "Creó una propiedad",
      ip: "192.168.0.2",
    },
  ]

  return (
    <main className="min-h-screen bg-(--surface) px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <BitacoraTable logs={logs} />
      </div>
    </main>
  )
}