export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}

export function formatCompactCOP(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(0)} mil M`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)} M`;
  }
  return formatCOP(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    month: "short",
    year: "numeric",
  }).format(date);
}

const ACRONYMS = new Set(["FIC", "FCP", "ETF", "AFP", "CDT", "TES", "DTF"]);

export function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      const stripped = word.replace(/^\(|\)$/g, "");
      const pre = word.startsWith("(") ? "(" : "";
      const post = word.endsWith(")") ? ")" : "";
      if (ACRONYMS.has(stripped.toUpperCase())) return pre + stripped.toUpperCase() + post;
      return pre + stripped.charAt(0).toUpperCase() + stripped.slice(1) + post;
    })
    .join(" ");
}

export function simplifyFundName(name: string): string {
  let s = name;

  // Core type replacements
  s = s.replace(/FONDO DE CAPITAL PRIVADO/gi, "FCP");
  s = s.replace(/FONDO CAPITAL PRIVADO/gi, "FCP");
  s = s.replace(/FONDO DE INVERSI[OÓ]N\s+COLECTIVA/gi, "FIC");
  s = s.replace(/FONDO DE INVERSION\s+COLECTIVA/gi, "FIC");
  s = s.replace(/FONDO DE INVERSION\s+COLECTA/gi, "FIC");
  s = s.replace(/CARTERA COLECTIVA/gi, "CC");

  // Remove pacto/permanencia phrases
  s = s.replace(/\s+SIN\s+PACTO\s+DE\s+PERMANENCIA/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+DE\s+PERMANENCIA\s+RENOVABLE/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+DE\s+PERMANENCIA/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+PERMANENCIA/gi, "");

  // Remove ABIERTO/ABIERTA (default type, redundant)
  s = s.replace(/\bABIERTO?\b/gi, "");
  s = s.replace(/\bABIERTA\b/gi, "");

  // CERRADO -> keep as marker
  s = s.replace(/\bCERRADA?\b/gi, "Cerrado");

  // Compartimento shortening
  s = s.replace(/SUBCOMPARTIMENTO/gi, "Subcomp.");
  s = s.replace(/COMPARTIMIENTOS/gi, "Comp.");
  s = s.replace(/COMPARTIMENTOS/gi, "Comp.");
  s = s.replace(/COMPARTIMIENTO/gi, "Comp.");
  s = s.replace(/COMPARTIMENTO/gi, "Comp.");
  s = s.replace(/COMPATIMENTO/gi, "Comp.");
  s = s.replace(/\bCOMPART\./gi, "Comp.");

  // (EN LIQUIDACIÓN) -> (Liq.)
  s = s.replace(/\(EN LIQUIDACI[OÓ]N\)/gi, "(Liq.)");
  s = s.replace(/EN LIQUIDACI[OÓ]N/gi, "(Liq.)");
  s = s.replace(/EN LIQUIDACION/gi, "(Liq.)");

  // Remove filler
  s = s.replace(/\s+DENOMINADO\s+/gi, " ");
  s = s.replace(/\s*-\s*CARTERA CON Comp\./gi, "");
  s = s.replace(/\s*- CARTERA CON COMPARTIMENTOS/gi, "");

  // Standalone FONDO patterns
  s = s.replace(/^FONDO BURS[AÁ]TIL/gi, "FIC Bursátil");
  s = s.replace(/^FONDO DE CO-INVERSI[OÓ]N/gi, "FCP Co-Inv.");
  s = s.replace(/^FONDO DE DEUDA SENIOR PARA INFRAESTRUCTURA/gi, "FCP Deuda Sr. Infra");
  s = s.replace(/^FONDO DE INFRAESTRUCTURA/gi, "FCP Infra");
  s = s.replace(/^FONDO Cerrado INMOBILIARIO/gi, "FIC Inmob.");
  s = s.replace(/^FONDO Cerrado SENTENCIAS/gi, "FIC Cerrado Sent.");
  s = s.replace(/^FONDO Cerrado/gi, "FIC Cerrado");
  s = s.replace(/^FONDO BLACKROCK/gi, "FCP Blackrock");
  s = s.replace(/^FONDO ASHMORE/gi, "FCP Ashmore");
  s = s.replace(/^FONDO NAZCA/gi, "FCP Nazca");
  s = s.replace(/^FONDO MERCADO/gi, "FCP Mercado");
  s = s.replace(/^FONDO DE CAPITAL\b/gi, "FCP");
  s = s.replace(/^FONDO CASH/gi, "FIC Cash");
  s = s.replace(/^FONDO ALIANZA/gi, "FIC Alianza");
  s = s.replace(/^FONDO DE INVERSION\b/gi, "FIC");
  s = s.replace(/^FONDO RENTA/gi, "FIC Renta");
  s = s.replace(/^FONDO\b/gi, "FIC");

  // Word-level shortening
  s = s.replace(/INMOBILIARIO/gi, "Inmob.");
  s = s.replace(/INMOBILIARIA/gi, "Inmob.");
  s = s.replace(/INMOBILIARIAS/gi, "Inmob.");
  s = s.replace(/INFRAESTRUCTURA/gi, "Infra");
  s = s.replace(/INTERNACIONAL/gi, "Intl.");

  // Handle mid-name FIC (e.g. "RENDIR FIC ABIERTO" -> "FIC RENDIR")
  if (!/^(FIC|FCP|F\.I\.C|F\.C\.P|CC)/i.test(s)) {
    const ficIdx = s.indexOf("FIC");
    if (ficIdx > 0) {
      const before = s.substring(0, ficIdx).trim();
      let after = s.substring(ficIdx + 3).trim();
      s = "FIC " + before + (after ? " " + after : "");
    }
  }

  // Normalize prefix dots
  s = s.replace(/^F\.I\.C\.\s*A\.\s*/g, "FIC ");
  s = s.replace(/^F\.I\.C\.\s*/g, "FIC ");
  s = s.replace(/^F\.C\.P\.\s*/g, "FCP ");
  s = s.replace(/^FCP\.\s*/g, "FCP ");

  // Remove double prefixes
  s = s.replace(/^FIC\s+FIC\b/gi, "FIC");
  s = s.replace(/^FCP\s+FCP\b/gi, "FCP");

  // Remove redundant phrases inside names
  s = s.replace(/CON EL FONDO DE/gi, "");
  s = s.replace(/DEL FONDO DE/gi, "");

  // Clean up whitespace
  s = s.replace(/\s+/g, " ").trim();

  return s;
}
