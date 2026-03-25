import { fetchLatestFunds } from "@/lib/api";
import { RankingClient } from "./ranking-client";

export const revalidate = 86400; // ISR: 24 hours

export default async function Home() {
  const funds = await fetchLatestFunds();

  return <RankingClient funds={funds} />;
}
