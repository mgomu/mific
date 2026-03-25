import jsPDF from "jspdf";
import type { FundRecord } from "./types";
import { CHART_COLORS } from "./chart-colors";
import {
  formatCOP,
  formatCompactCOP,
  formatNumber,
  toSentenceCase,
} from "./format";
import { registerFonts } from "./pdf-fonts";

interface PdfFundData {
  fundData: Map<string, FundRecord[]>;
  fundNames: Map<string, string>;
  fundEntities: Map<string, string>;
  latestPerFund: FundRecord[];
}

// Design system tokens
const C = {
  primary: [0, 35, 111] as RGB,
  primaryContainer: [30, 58, 138] as RGB,
  secondary: [0, 106, 97] as RGB,
  error: [186, 26, 26] as RGB,
  onSurface: [25, 28, 30] as RGB,
  onSurfaceVariant: [68, 70, 81] as RGB,
  surface: [247, 249, 251] as RGB,
  surfaceContainerLow: [242, 244, 246] as RGB,
  surfaceContainerLowest: [255, 255, 255] as RGB,
  outline: [197, 197, 211] as RGB,
};

type RGB = [number, number, number];

function hex2rgb(hex: string): RGB {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)]
    : [0, 0, 0];
}

function rr(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: "F" | "S" | "FD" = "F"
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

// ── Profitability pill (mirrors ProfitabilityIndicator component) ──
function drawPill(
  doc: jsPDF,
  value: number,
  x: number,
  y: number,
  decimals = 2
) {
  const positive = value >= 0;
  const label = `${positive ? "+" : "-"}${Math.abs(value).toFixed(decimals)}%`;

  doc.setFont("Inter", "bold");
  doc.setFontSize(6.5);
  const textW = doc.getTextWidth(label);
  const pillW = textW + 5;
  const pillH = 4.5;

  // Background — green tint for positive, red tint for negative
  doc.setFillColor(
    positive ? 210 : 255,
    positive ? 250 : 230,
    positive ? 243 : 228
  );
  rr(doc, x, y, pillW, pillH, 2.2, "F");

  // Text
  doc.setTextColor(...(positive ? C.secondary : C.error));
  doc.text(label, x + 2.5, y + 3.3);

  return pillW;
}

// ── Draw a line chart into a bounded region ──
function drawChart(
  doc: jsPDF,
  fundData: Map<string, FundRecord[]>,
  fundNames: Map<string, string>,
  metric: "rentabilidadAnual" | "valorUnidad",
  title: string,
  left: number,
  top: number,
  width: number,
  height: number,
  isPercentage: boolean
) {
  const chartPadLeft = 22;
  const chartPadTop = 14;
  const chartPadBottom = 14;
  const chartPadRight = 4;

  const cLeft = left + chartPadLeft;
  const cRight = left + width - chartPadRight;
  const cTop = top + chartPadTop;
  const cBottom = top + height - chartPadBottom;
  const cW = cRight - cLeft;
  const cH = cBottom - cTop;

  // Card
  doc.setFillColor(...C.surfaceContainerLowest);
  rr(doc, left, top, width, height, 2.5, "F");

  // Title — Manrope bold (headline font)
  doc.setFont("Manrope", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.primary);
  doc.text(title, left + 6, top + 8);

  // Collect series
  const codigos = [...fundData.keys()];
  const allDates: string[] = [];
  let minVal = Infinity;
  let maxVal = -Infinity;
  const series = new Map<string, { date: string; value: number }[]>();

  const ytdStart = new Date(new Date().getFullYear(), 0, 1);

  for (const [codigo, records] of fundData) {
    const pts: { date: string; value: number }[] = [];
    for (const r of records) {
      if (r.fechaCorte < ytdStart) continue;
      const dk = r.fechaCorte.toISOString().split("T")[0];
      const v = metric === "valorUnidad" ? r.valorUnidad : r[metric];
      pts.push({ date: dk, value: v });
      if (!allDates.includes(dk)) allDates.push(dk);
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }
    series.set(codigo, pts);
  }

  allDates.sort();
  if (!allDates.length || minVal === Infinity) return;

  const range = maxVal - minVal || 1;
  const pMin = minVal - range * 0.05;
  const pMax = maxVal + range * 0.05;

  // Grid
  doc.setDrawColor(...C.outline);
  doc.setLineWidth(0.08);
  const gridN = 4;
  for (let i = 0; i <= gridN; i++) {
    const y = cTop + (cH * i) / gridN;
    doc.line(cLeft, y, cRight, y);
    const v = pMax - ((pMax - pMin) * i) / gridN;
    doc.setFont("Inter", "normal");
    doc.setFontSize(5);
    doc.setTextColor(...C.onSurfaceVariant);
    const lbl = isPercentage
      ? `${v.toFixed(1)}%`
      : `$${Math.round(v).toLocaleString()}`;
    doc.text(lbl, cLeft - 2, y + 1.2, { align: "right" });
  }

  // X labels
  const step = Math.max(1, Math.floor(allDates.length / 5));
  doc.setFontSize(5);
  for (let i = 0; i < allDates.length; i += step) {
    const x = cLeft + (cW * i) / (allDates.length - 1);
    const d = new Date(allDates[i]);
    doc.setFont("Inter", "normal");
    doc.setTextColor(...C.onSurfaceVariant);
    doc.text(
      d.toLocaleDateString("es-CO", { month: "short" }),
      x,
      cBottom + 4,
      { align: "center" }
    );
  }

  // Lines
  codigos.forEach((codigo, idx) => {
    const pts = series.get(codigo) ?? [];
    if (pts.length < 2) return;
    const rgb = hex2rgb(CHART_COLORS[idx % CHART_COLORS.length]);
    doc.setDrawColor(...rgb);
    doc.setLineWidth(0.5);

    for (let i = 1; i < pts.length; i++) {
      const di0 = allDates.indexOf(pts[i - 1].date);
      const di1 = allDates.indexOf(pts[i].date);
      if (di0 === -1 || di1 === -1) continue;

      const x0 = cLeft + (cW * di0) / (allDates.length - 1);
      const y0 = cTop + cH * (1 - (pts[i - 1].value - pMin) / (pMax - pMin));
      const x1 = cLeft + (cW * di1) / (allDates.length - 1);
      const y1 = cTop + cH * (1 - (pts[i].value - pMin) / (pMax - pMin));
      doc.line(x0, y0, x1, y1);
    }
  });
}

// ── Main export ──
export async function generateComparisonPDF({
  fundData,
  fundNames,
  fundEntities,
  latestPerFund,
}: PdfFundData) {
  const doc = new jsPDF("p", "mm", "a4");

  // Register Inter + Manrope fonts
  await registerFonts(doc);

  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 14; // margin
  const cw = pw - m * 2; // content width
  const codigos = [...fundData.keys()];
  const numFunds = codigos.length;

  // ── Page background ──
  doc.setFillColor(...C.surface);
  doc.rect(0, 0, pw, ph, "F");

  // ── HEADER BAR ──
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pw, 28, "F");
  doc.setFillColor(...C.primaryContainer);
  doc.rect(0, 25, pw, 3, "F");

  doc.setFont("Manrope", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Comparaci\u00f3n de Fondos", m, 12);

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 225, 255);
  const dateStr = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(
    `Analiza y compara el rendimiento hist\u00f3rico de tus selecciones  \u00b7  ${dateStr}`,
    m,
    19
  );

  let y = 34;

  // ── FUND CARDS (mirroring the sidebar cards) ──
  const cardGap = 4;
  const cardW = (cw - cardGap * (numFunds - 1)) / numFunds;
  const cardTextW = cardW - 8; // text area width (4mm padding each side)

  // Pre-compute wrapped names to determine tallest card
  const cardData = codigos.map((codigo, i) => {
    const fund = latestPerFund.find((f) => f.codigoNegocio === codigo);
    const entity = toSentenceCase(fundEntities.get(codigo) ?? "");
    const name = toSentenceCase(fundNames.get(codigo) ?? codigo);

    doc.setFont("Manrope", "bold");
    doc.setFontSize(7);
    const wrappedName: string[] = doc.splitTextToSize(name, cardTextW);

    return { codigo, fund, entity, wrappedName, color: hex2rgb(CHART_COLORS[i % CHART_COLORS.length]) };
  });

  const nameLineH = 3.5;
  const maxNameLines = Math.max(...cardData.map((d) => d.wrappedName.length));
  const cardH = 16 + maxNameLines * nameLineH + 12; // top padding + name + divider + bottom section

  cardData.forEach((data, i) => {
    const { fund, entity, wrappedName, color } = data;
    const x = m + i * (cardW + cardGap);

    // Card bg
    doc.setFillColor(...C.surfaceContainerLowest);
    rr(doc, x, y, cardW, cardH, 2.5, "F");

    // Left accent bar
    doc.setFillColor(...color);
    doc.rect(x, y + 3, 1.2, cardH - 6, "F");

    // Entity name
    doc.setFont("Inter", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(...C.onSurfaceVariant);
    doc.text(entity, x + 4, y + 6);

    // Fund name — Manrope bold, wrapped
    doc.setFont("Manrope", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.onSurface);
    doc.text(wrappedName, x + 4, y + 11);

    const nameBlockBottom = y + 11 + (wrappedName.length - 1) * nameLineH;
    const dividerY = nameBlockBottom + 3;

    // Divider line
    doc.setDrawColor(220, 222, 228);
    doc.setLineWidth(0.15);
    doc.line(x + 4, dividerY, x + cardW - 4, dividerY);

    // Rent. YTD label
    doc.setFont("Inter", "bold");
    doc.setFontSize(4.5);
    doc.setTextColor(...C.onSurfaceVariant);
    doc.text("RENT. YTD", x + 4, dividerY + 5.5);

    // Rent value in fund color
    if (fund) {
      doc.setFont("Manrope", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...color);
      doc.text(
        `${fund.rentabilidadAnual >= 0 ? "+" : ""}${fund.rentabilidadAnual.toFixed(1)}%`,
        x + cardW - 4,
        dividerY + 6.5,
        { align: "right" }
      );
    }
  });

  y += cardH + 6;

  // ── CHARTS SIDE BY SIDE ──
  const chartGap = 5;
  const chartW = (cw - chartGap) / 2;
  const chartH = 68;

  drawChart(
    doc,
    fundData,
    fundNames,
    "rentabilidadAnual",
    "Rentabilidad E.A.",
    m,
    y,
    chartW,
    chartH,
    true
  );

  drawChart(
    doc,
    fundData,
    fundNames,
    "valorUnidad",
    "Valor de la Unidad",
    m + chartW + chartGap,
    y,
    chartW,
    chartH,
    false
  );

  // Shared legend under charts
  y += chartH + 3;
  let legendX = m + 6;
  doc.setFontSize(5.5);
  codigos.forEach((codigo, idx) => {
    const rgb = hex2rgb(CHART_COLORS[idx % CHART_COLORS.length]);
    doc.setFillColor(...rgb);
    doc.circle(legendX + 1.2, y + 1, 1.2, "F");
    doc.setFont("Inter", "bold");
    doc.setTextColor(...C.onSurface);
    const nm = toSentenceCase(
      (fundNames.get(codigo) ?? codigo).slice(0, 26)
    );
    doc.text(nm, legendX + 4, y + 2);
    legendX += doc.getTextWidth(nm) + 10;
  });

  y += 8;

  // ── COMPARISON TABLE (Métricas Comparativas) ──
  doc.setFillColor(...C.surfaceContainerLowest);
  const labelColW = 38;
  const dataColW = (cw - labelColW) / numFunds;
  const rowH = 8.5;
  const headerH = 10;

  const tableRows: {
    label: string;
    getValue: (f: FundRecord) => string;
    isPill?: boolean;
  }[] = [
    { label: "Valor Unidad", getValue: (f) => formatCOP(f.valorUnidad) },
    {
      label: "Valor del Fondo",
      getValue: (f) => formatCompactCOP(f.valorFondo),
    },
    {
      label: "Inversionistas",
      getValue: (f) => formatNumber(f.numeroInversionistas),
    },
    {
      label: "Rent. Diaria",
      getValue: (f) => String(f.rentabilidadDiaria),
      isPill: true,
    },
    {
      label: "Rent. Mensual",
      getValue: (f) => String(f.rentabilidadMensual),
      isPill: true,
    },
    {
      label: "Rent. Semestral",
      getValue: (f) => String(f.rentabilidadSemestral),
      isPill: true,
    },
    {
      label: "Rent. Efectiva Anual",
      getValue: (f) => String(f.rentabilidadAnual),
      isPill: true,
    },
  ];

  const totalTableH = headerH + tableRows.length * rowH + 14;

  // Check page overflow
  if (y + totalTableH > ph - 18) {
    doc.addPage();
    doc.setFillColor(...C.surface);
    doc.rect(0, 0, pw, ph, "F");
    y = m;
  }

  // Table card background
  rr(doc, m, y, cw, totalTableH, 2.5, "F");

  // Table title — Manrope
  doc.setFont("Manrope", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.primary);
  doc.text("M\u00e9tricas Comparativas", m + 6, y + 8);
  y += 14;

  // Header row
  doc.setFillColor(...C.surface);
  doc.rect(m, y, cw, headerH, "F");

  doc.setFont("Inter", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(...C.onSurfaceVariant);
  doc.text("M\u00c9TRICA", m + 4, y + 6.5);

  latestPerFund.forEach((fund, i) => {
    const x = m + labelColW + i * dataColW;
    const rgb = hex2rgb(CHART_COLORS[i % CHART_COLORS.length]);

    // Color dot
    doc.setFillColor(...rgb);
    doc.circle(x + 2, y + 4.5, 1.3, "F");

    // Entity
    doc.setFont("Inter", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(...C.primary);
    doc.text(
      toSentenceCase(fund.nombreEntidad).slice(0, 20),
      x + 5,
      y + 4.5
    );

    // Name
    doc.setFont("Manrope", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...C.onSurface);
    doc.text(
      toSentenceCase(fund.nombrePatrimonio).slice(0, 20),
      x + 5,
      y + 8
    );
  });

  y += headerH;

  // Data rows
  tableRows.forEach((row, idx) => {
    // Alternating bg
    doc.setFillColor(
      ...(idx % 2 === 0 ? C.surfaceContainerLowest : C.surfaceContainerLow)
    );
    doc.rect(m, y, cw, rowH, "F");

    // Label
    doc.setFont("Inter", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.onSurfaceVariant);
    doc.text(row.label, m + 4, y + 5.5);

    // Values
    latestPerFund.forEach((fund, i) => {
      const x = m + labelColW + i * dataColW;

      if (row.isPill) {
        const numVal = parseFloat(row.getValue(fund));
        drawPill(doc, numVal, x + 2, y + 2, 2);
      } else {
        doc.setFont("Inter", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(...C.onSurface);
        doc.text(row.getValue(fund), x + 2, y + 5.5);
      }
    });

    y += rowH;
  });

  // ── FOOTER ──
  const footerY = ph - 10;
  doc.setDrawColor(...C.outline);
  doc.setLineWidth(0.15);
  doc.line(m, footerY - 3, pw - m, footerY - 3);

  doc.setFont("Inter", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...C.onSurfaceVariant);
  doc.text(
    "Fuente: Superintendencia Financiera de Colombia  \u00b7  datos.gov.co  \u00b7  Generado por mific.co",
    m,
    footerY
  );
  doc.text(
    "Este reporte es informativo y no constituye asesor\u00eda financiera.",
    pw - m,
    footerY,
    { align: "right" }
  );

  // Save
  doc.save(
    `comparacion-fondos-${new Date().toISOString().split("T")[0]}.pdf`
  );
}
