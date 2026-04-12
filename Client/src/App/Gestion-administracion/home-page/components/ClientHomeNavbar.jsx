import { Link } from "react-router"

export const ClientHomeNavbar = ({ links }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-(--outline-variant)/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/client" className="text-xl font-black tracking-tight text-(--primary)">
          Architectural Curator
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((label) => (
            <button
              key={label}
              type="button"
              className="text-sm font-semibold text-(--on-surface-variant) transition hover:text-(--primary)"
            >
              {label}
            </button>
          ))}
        </nav>

        <Link
          to="/client/become-agent"
          className="rounded-full bg-(--primary) px-4 py-2 text-sm font-bold text-(--on-primary) transition hover:brightness-95"
        >
          Publicar propiedad
        </Link>
      </div>
    </header>
  )
}
