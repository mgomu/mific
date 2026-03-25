const TYPE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  general: {
    label: "General",
    bg: "bg-surface-container-high",
    text: "text-on-surface",
  },
  inmobiliario: {
    label: "Inmobiliario",
    bg: "bg-primary-fixed/40",
    text: "text-primary",
  },
  monetario: {
    label: "Mercado Monetario",
    bg: "bg-secondary-fixed/40",
    text: "text-secondary",
  },
  bursátil: {
    label: "Bursátil",
    bg: "bg-tertiary-fixed/40",
    text: "text-on-tertiary-fixed",
  },
  capitalPrivado: {
    label: "Capital Privado",
    bg: "bg-error-container/40",
    text: "text-on-error-container",
  },
};

function classifyType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("inmobiliaria") || lower.includes("inmobiliario")) return "inmobiliario";
  if (lower.includes("monetario")) return "monetario";
  if (lower.includes("bursatil") || lower.includes("bursátil")) return "bursátil";
  if (lower.includes("capital privado")) return "capitalPrivado";
  return "general";
}

export function FundTypeBadge({ type }: { type: string }) {
  const key = classifyType(type);
  const config = TYPE_MAP[key] ?? TYPE_MAP.general;

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
