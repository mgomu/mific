import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchLatestFunds, fetchFundHistory, fetchFundsComparison } from "../api";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockFundRecord = {
  codigo_negocio: "8686",
  nombre_entidad: "BBVA Asset Management",
  nombre_patrimonio: "FIC Renta Sostenible",
  nombre_tipo_patrimonio: "FIC de tipo general",
  nombre_subtipo_patrimonio: "Abierto",
  valor_unidad_operaciones_dia_t: "18240.37",
  valor_fondo_cierre_dia_t: "75905000000",
  numero_inversionistas: "12458",
  rentabilidad_diaria: "0.02",
  rentabilidad_mensual: "0.65",
  rentabilidad_semestral: "4.78",
  rentabilidad_anual: "8.42",
  fecha_corte: "2026-03-21T00:00:00.000",
  rendimientos_abonados: "500000",
  aportes_recibidos: "1000000",
  retiros_redenciones: "200000",
};

describe("fetchLatestFunds", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetches and parses fund data from SODA API", async () => {
    // fetchLatestFunds makes two fetch calls: one for date, one for data
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockFundRecord],
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockFundRecord],
    });

    const funds = await fetchLatestFunds();

    expect(funds).toHaveLength(1);
    expect(funds[0].codigoNegocio).toBe("8686");
    expect(funds[0].nombreEntidad).toBe("BBVA Asset Management");
    expect(funds[0].valorUnidad).toBe(18240.37);
    expect(funds[0].rentabilidadAnual).toBe(8.42);
    expect(funds[0].fechaCorte).toBeInstanceOf(Date);
  });

  it("throws on API error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchLatestFunds()).rejects.toThrow("SODA API error");
  });
});

describe("fetchFundHistory", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetches historical data for a single fund", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockFundRecord],
    });

    const history = await fetchFundHistory("8686");

    expect(history).toHaveLength(1);
    expect(history[0].codigoNegocio).toBe("8686");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("codigo_negocio='8686'"),
      expect.any(Object)
    );
  });
});

describe("fetchFundsComparison", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("fetches data for multiple funds", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockFundRecord, { ...mockFundRecord, codigo_negocio: "8734" }],
    });

    const data = await fetchFundsComparison(["8686", "8734"]);

    expect(data).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("codigo_negocio in"),
      expect.any(Object)
    );
  });
});
