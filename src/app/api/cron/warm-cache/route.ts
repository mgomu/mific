import { fetchLatestFunds } from "@/lib/api";

export const maxDuration = 300; // 5 min (Vercel Pro limit)

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const funds = await fetchLatestFunds();
  const codes = [...new Set(funds.map((f) => f.codigoNegocio))];

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  let warmed = 0;
  let failed = 0;

  // Warm in batches of 5 with a small delay to avoid rate limits
  for (let i = 0; i < codes.length; i += 5) {
    const batch = codes.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((code) =>
        fetch(`${baseUrl}/fondo/${code}`, { cache: "no-store" })
      )
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value.ok) warmed++;
      else failed++;
    }
    // Small delay between batches
    if (i + 5 < codes.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return Response.json({ warmed, failed, total: codes.length });
}
