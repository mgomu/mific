const TYPE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  general: {
    label: "General",
    bg: "bg-surface-container-high",
    text: "text-on-surface",
  },
  inmobiliario: {
    label: "Inmobiliario",
    bg: "bg-secondary-fixed",
    text: "text-on-secondary-fixed",
  },
  monetario: {
    label: "Mercado Monetario",
    bg: "bg-primary-fixed",
    text: "text-on-primary-fixed",
  },
  bursátil: {
    label: "Bursátil",
    bg: "bg-tertiary-fixed",
    text: "text-on-tertiary-fixed",
  },
  capitalPrivado: {
    label: "Capital Privado",
    bg: "bg-error-container",
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
