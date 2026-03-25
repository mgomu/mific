export function Footer({ fechaCorte }: { fechaCorte?: string }) {
  return (
    <footer className="mt-12 py-6 border-t border-outline-variant/20">
      <div className="max-w-[1440px] mx-auto px-8 text-center">
        <p className="text-xs text-on-surface-variant">
          Datos de la Superintendencia Financiera de Colombia
          {fechaCorte && ` — Actualizados al ${fechaCorte}`}
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          mific es un proyecto de código abierto sin ánimo de lucro
        </p>
      </div>
    </footer>
  );
}
