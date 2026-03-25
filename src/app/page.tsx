import { fetchLatestFunds } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { RankingClient } from "./ranking-client";

export const revalidate = 86400; // ISR: 24 hours

export default async function Home() {
  const funds = await fetchLatestFunds();
  const fechaCorte =
    funds.length > 0 ? formatDate(funds[0].fechaCorte) : undefined;

  return <RankingClient funds={funds} fechaCorte={fechaCorte} />;
}
