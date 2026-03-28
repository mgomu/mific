import { describe, it, expect } from "vitest";
import { formatCOP, formatNumber, formatDate, simplifyFundName } from "../format";

describe("formatCOP", () => {
  it("formats peso amounts", () => {
    expect(formatCOP(18240.37)).toBe("$\u00a018.240,37");
  });

  it("formats zero", () => {
    expect(formatCOP(0)).toBe("$\u00a00,00");
  });
});

describe("formatNumber", () => {
  it("formats with thousand separators", () => {
    expect(formatNumber(12458)).toBe("12.458");
  });
});

describe("formatDate", () => {
  it("formats date in Spanish", () => {
    const date = new Date("2026-03-21");
    const formatted = formatDate(date);
    expect(formatted).toContain("2026");
  });
});

describe("simplifyFundName", () => {
  it("simplifies 'Fondo de Inversión Colectiva' to FIC", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA ABIERTO SIN PACTO DE PERMANENCIA OCCITESOROS"))
      .toBe("FIC OCCITESOROS");
  });

  it("simplifies 'Fondo de Capital Privado' to FCP", () => {
    expect(simplifyFundName("FONDO DE CAPITAL PRIVADO PACTIA INMOBILIARIO"))
      .toBe("FCP PACTIA Inmob.");
  });

  it("simplifies 'Cartera Colectiva' to CC", () => {
    expect(simplifyFundName("CARTERA COLECTIVA ABIERTA CON PACTO DE PERMANENCIA EFECTIVO A PLAZOS - CARTERA CON COMPARTIMENTOS"))
      .toBe("CC EFECTIVO A PLAZOS");
  });

  it("removes pacto de permanencia phrases", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA ABIERTO CON PACTO DE PERMANENCIA ALTARENTA"))
      .toBe("FIC ALTARENTA");
  });

  it("shortens Compartimento to Comp.", () => {
    expect(simplifyFundName("FCP STATUM COMPARTIMIENTO I"))
      .toBe("FCP STATUM Comp. I");
  });

  it("shortens (EN LIQUIDACIÓN) to (Liq.)", () => {
    expect(simplifyFundName("FCP VALOR FORESTAL CAUCHO 8 (EN LIQUIDACIÓN)"))
      .toBe("FCP VALOR FORESTAL CAUCHO 8 (Liq.)");
  });

  it("shortens Inmobiliario to Inmob.", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA INMOBILIARIO SIRENTA"))
      .toBe("FIC Inmob. SIRENTA");
  });

  it("shortens Infraestructura to Infra", () => {
    expect(simplifyFundName("FCP DEUDA INFRAESTRUCTURA COLOMBIA"))
      .toBe("FCP DEUDA Infra COLOMBIA");
  });

  it("shortens Internacional to Intl.", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA DIVERSIFICADO INTERNACIONAL"))
      .toBe("FIC DIVERSIFICADO Intl.");
  });

  it("handles F.I.C. prefix", () => {
    expect(simplifyFundName("F.I.C. ABIERTA CON PACTO DE PERMANENCIA SOSTENIBLE GLOBAL"))
      .toBe("FIC SOSTENIBLE GLOBAL");
  });

  it("handles F.C.P. prefix", () => {
    expect(simplifyFundName("F.C.P. VID COMPARTIMENTO II JIDUSH"))
      .toBe("FCP VID Comp. II JIDUSH");
  });

  it("handles mid-name FIC (RENDIR pattern)", () => {
    expect(simplifyFundName("RENDIR FONDO DE INVERSION COLECTIVA ABIERTO"))
      .toBe("FIC RENDIR");
  });

  it("leaves already short names unchanged", () => {
    expect(simplifyFundName("BTG PACTUAL DINAMICO"))
      .toBe("BTG PACTUAL DINAMICO");
  });

  it("handles FONDO CERRADO pattern", () => {
    expect(simplifyFundName("FONDO CERRADO INMOBILIARIO ALIANZA"))
      .toBe("FIC Inmob. ALIANZA");
  });

  it("handles FONDO BURSÁTIL pattern", () => {
    expect(simplifyFundName("FONDO BURSÁTIL ISHARES  MSCI COLCAP"))
      .toBe("FIC Bursátil ISHARES MSCI COLCAP");
  });
});
