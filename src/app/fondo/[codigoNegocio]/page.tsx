import { fetchFundHistory } from "@/lib/api";
import { DetailClient } from "./detail-client";
import { notFound } from "next/navigation";

export const revalidate = 86400; // ISR: 24h

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ codigoNegocio: string }>;
}) {
  const { codigoNegocio } = await params;
  const history = await fetchFundHistory(codigoNegocio);

  if (history.length === 0) notFound();

  return <DetailClient history={history} />;
}
