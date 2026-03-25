import { describe, it, expect } from "vitest";
import { formatCOP, formatNumber, formatDate } from "../format";

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
