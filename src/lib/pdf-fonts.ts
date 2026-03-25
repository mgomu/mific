import jsPDF from "jspdf";

const FONT_FILES: { path: string; family: string; style: string }[] = [
  { path: "/fonts/Inter-Regular.ttf", family: "Inter", style: "normal" },
  { path: "/fonts/Inter-Bold.ttf", family: "Inter", style: "bold" },
  { path: "/fonts/Manrope-Bold.ttf", family: "Manrope", style: "normal" },
  { path: "/fonts/Manrope-ExtraBold.ttf", family: "Manrope", style: "bold" },
];

// Cache so fonts are only fetched once per session
const fontCache = new Map<string, string>();

async function fetchFontAsBase64(path: string): Promise<string> {
  if (fontCache.has(path)) return fontCache.get(path)!;

  const res = await fetch(path);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  fontCache.set(path, b64);
  return b64;
}

/**
 * Registers Inter and Manrope into a jsPDF instance.
 *   doc.setFont("Inter", "normal")  — Inter Regular (body)
 *   doc.setFont("Inter", "bold")    — Inter Bold (body emphasis)
 *   doc.setFont("Manrope", "normal") — Manrope Bold (headline regular)
 *   doc.setFont("Manrope", "bold")  — Manrope ExtraBold (headline emphasis)
 */
export async function registerFonts(doc: jsPDF): Promise<void> {
  const results = await Promise.all(
    FONT_FILES.map(async ({ path, family, style }) => {
      const b64 = await fetchFontAsBase64(path);
      return { path, family, style, b64 };
    })
  );

  for (const { path, family, style, b64 } of results) {
    const fileName = path.split("/").pop()!;
    doc.addFileToVFS(fileName, b64);
    doc.addFont(fileName, family, style);
  }
}
