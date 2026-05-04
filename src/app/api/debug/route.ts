import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.datos.gov.co/resource/qhpu-8ixx.json";
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN ?? "";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Supabase: count rows in fund_records
  const { count: totalRows, error: countError } = await supabase
    .from("fund_records")
    .select("*", { count: "exact", head: true });
  results.supabase_fund_records_total = countError ? `ERROR: ${countError.message}` : totalRows;

  // 2. Supabase: count rows in fund_latest view
  const { count: latestCount, error: latestError } = await supabase
    .from("fund_latest")
    .select("*", { count: "exact", head: true });
  results.supabase_fund_latest_count = latestError ? `ERROR: ${latestError.message}` : latestCount;

  // 3. Supabase: what dates exist?
  const { data: dates, error: datesError } = await supabase
    .from("fund_records")
    .select("fecha_corte")
    .order("fecha_corte", { ascending: false })
    .limit(5);
  results.supabase_latest_dates = datesError ? `ERROR: ${datesError.message}` : dates?.map((d) => d.fecha_corte);

  // 4. Socrata: latest date available
  try {
    const headers: HeadersInit = {};
    if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;
    const dateRes = await fetch(
      `${BASE_URL}?$select=fecha_corte&$order=fecha_corte DESC&$limit=1`,
      { headers, cache: "no-store" }
    );
    if (!dateRes.ok) {
      results.socrata_latest_date = `HTTP ${dateRes.status}`;
    } else {
      const dateJson = await dateRes.json();
      results.socrata_latest_date = dateJson[0]?.fecha_corte ?? "no data";

      // 5. Socrata: count for that date
      const latestDate = dateJson[0]?.fecha_corte?.split("T")[0];
      if (latestDate) {
        const countRes = await fetch(
          `${BASE_URL}?$select=COUNT(codigo_negocio)&$where=fecha_corte='${latestDate}'`,
          { headers, cache: "no-store" }
        );
        const countJson = await countRes.json();
        results.socrata_count_for_latest_date = countJson;
      }
    }
  } catch (err) {
    results.socrata_error = String(err);
  }

  results.socrata_app_token_set = !!APP_TOKEN;
  results.supabase_url_set = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  results.supabase_anon_key_set = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Response.json(results, { status: 200 });
}
