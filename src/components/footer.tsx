export function Footer({ fechaCorte }: { fechaCorte?: string }) {
  return (
    <footer className="w-full py-12 mt-12 bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <span className="text-lg font-bold text-on-surface-variant/40 font-display">
            mific
          </span>
          <p className="text-xs text-on-surface-variant mt-2">
            Datos actualizados{fechaCorte ? ` al ${fechaCorte}` : ""}. Fuente:
            Superintendencia Financiera de Colombia.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Metodología
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Términos de Servicio
          </span>
          <span className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Acceso API
          </span>
        </div>
      </div>
      <div className="mt-8 text-[10px] text-on-surface-variant/40 text-center uppercase tracking-widest font-medium">
        &copy; {new Date().getFullYear()} mific Sistemas de Inteligencia Financiera.
      </div>
    </footer>
  );
}
