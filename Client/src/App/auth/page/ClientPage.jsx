import { Link } from "react-router"

export const ClientPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      
      <h1 className="text-2xl font-bold">
        Bienvenido, Cliente
      </h1>

      <p className="text-(--on-surface-variant)">
        Actualmente estás registrado como cliente.
      </p>

      <Link
        to="/client/become-agent"
        className="rounded-lg bg-(--primary) px-6 py-3 font-semibold text-(--on-primary) hover:opacity-90 transition"
      >
        Become Agent
      </Link>

    </div>
  )
}