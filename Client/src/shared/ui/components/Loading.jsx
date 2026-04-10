export const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-(--surface)">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-(--primary)/20 border-t-(--primary) rounded-full animate-spin" />
      <p className="text-sm text-(--on-surface-variant)">Cargando...</p>
    </div>
  </div>
)