import { fetchLatestFunds } from "@/lib/api";
import { RankingClient } from "./ranking-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const funds = await fetchLatestFunds();

  return <RankingClient funds={funds} />;
}
