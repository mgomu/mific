import type { FundRecord } from "@/lib/types";
import { ProfitabilityIndicator } from "./profitability-indicator";
import { formatCOP, formatNumber, formatCompactCOP } from "@/lib/format";

const CHART_COLORS = ["#2563eb", "#7C3AED", "#F59E0B", "#10B981", "#EF4444"];

interface ComparisonTableProps {
  funds: FundRecord[];
}

type Row = {
  label: string;
  render: (fund: FundRecord) => React.ReactNode;
};

const ROWS: Row[] = [
  { label: "Administradora", render: (f) => f.nombreEntidad },
  { label: "Tipo", render: (f) => f.nombreTipoPatrimonio },
  { label: "Subtipo", render: (f) => f.nombreSubtipoPatrimonio },
  {
    label: "Valor de la unidad",
    render: (f) => <span className="tabular-nums">{formatCOP(f.valorUnidad)}</span>,
  },
  {
    label: "Rent. diaria",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadDiaria} />,
  },
  {
    label: "Rent. mensual",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadMensual} />,
  },
  {
    label: "Rent. semestral",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadSemestral} />,
  },
  {
    label: "Rent. anual",
    render: (f) => <ProfitabilityIndicator value={f.rentabilidadAnual} />,
  },
  {
    label: "N\u00ba inversionistas",
    render: (f) => <span className="tabular-nums">{formatNumber(f.numeroInversionistas)}</span>,
  },
  {
    label: "Valor del fondo",
    render: (f) => <span className="tabular-nums">{formatCompactCOP(f.valorFondo)}</span>,
  },
];

export function ComparisonTable({ funds }: ComparisonTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-lg font-semibold text-on-surface">
          Comparaci\u00f3n detallada
        </h2>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 bg-surface-container-low px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-[180px]">
                M\u00e9trica
              </th>
              {funds.map((fund, i) => (
                <th key={fund.codigoNegocio} className="px-4 py-3 text-left min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-on-surface truncate max-w-[140px]">
                        {fund.nombrePatrimonio}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {fund.nombreEntidad}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="sticky left-0 bg-surface-container-low/80 backdrop-blur-sm px-4 py-3 text-xs font-medium text-on-surface-variant">
                  {row.label}
                </td>
                {funds.map((fund) => (
                  <td
                    key={fund.codigoNegocio}
                    className="px-4 py-3 text-right"
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
