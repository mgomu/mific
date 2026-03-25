import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">
          search_off
        </span>
        <h1 className="text-2xl font-bold text-on-surface mb-2">
          Página no encontrada
        </h1>
        <p className="text-on-surface-variant mb-6">
          El fondo o página que buscas no existe.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          Volver al ranking
        </Link>
      </div>
    </main>
  );
}
