"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">
          warning
        </span>
        <h1 className="text-xl font-bold text-on-surface mb-2 font-headline">
          No pudimos cargar los datos
        </h1>
        <p className="text-sm text-on-surface-variant mb-6 max-w-md">
          Los datos provienen de la Superintendencia Financiera. Intenta de nuevo
          en unos minutos.
        </p>
        <button
          onClick={reset}
          className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-full text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
