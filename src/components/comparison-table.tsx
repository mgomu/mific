import type { FundRecord } from "@/lib/types";
import { ProfitabilityIndicator } from "./profitability-indicator";
import { formatCOP, formatNumber, formatCompactCOP, toSentenceCase } from "@/lib/format";
import { CHART_COLORS } from "@/lib/chart-colors";

interface ComparisonTableProps {
  funds: FundRecord[];
}

type Row = {
  label: string;
  render: (fund: FundRecord) => React.ReactNode;
};

const ROWS: Row[] = [
  {
    label: "Valor Unidad",
    render: (f) => <span className="font-bold tabular-nums">{formatCOP(f.valorUnidad)}</span>,
  },
  {
    label: "Valor del Fondo",
    render: (f) => <span className="font-bold tabular-nums">{formatCompactCOP(f.valorFondo)}</span>,
  },
  {
    label: "Inversionistas",
    render: (f) => <span className="font-bold tabular-nums">{formatNumber(f.numeroInversionistas)}</span>,
  },
  {
    label: "Rentabilidad Diaria",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadDiaria} />,
  },
  {
    label: "Rentabilidad Mensual",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadMensual} />,
  },
  {
    label: "Rentabilidad Semestral",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadSemestral} />,
  },
  {
    label: "Rentabilidad Anual",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadAnual} />,
  },
];

export function ComparisonTable({ funds }: ComparisonTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-surface-container">
        <h2 className="font-display text-xl font-bold text-primary">
          Métricas Comparativas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Métrica
              </th>
              {funds.map((fund, i) => (
                <th key={fund.codigoNegocio} className="p-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-primary">{toSentenceCase(fund.nombreEntidad)}</p>
                      <p className="text-sm font-bold text-on-surface truncate max-w-[140px]">
                        {toSentenceCase(fund.nombrePatrimonio)}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td className="p-4 font-semibold text-on-surface-variant">
                  {row.label}
                </td>
                {funds.map((fund) => (
                  <td
                    key={fund.codigoNegocio}
                    className="p-4 text-center"
                  >
                    {row.render(fund)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
