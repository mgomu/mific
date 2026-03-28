# Simplify Fund Names for Mobile Display

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify long fund names from the datos.gov.co API for mobile-friendly display, while preserving searchability by both original and simplified names.

**Architecture:** Add a `simplifyFundName()` function in `format.ts` that applies regex-based rules to shorten names (e.g. "Fondo de Inversión Colectiva" → "FIC"). All display points use `toSentenceCase(simplifyFundName(name))`. Search logic matches against both the original `nombrePatrimonio` AND the simplified version, so users can find a fund by either name.

**Tech Stack:** TypeScript, Next.js (React), Vitest

---

### Task 1: Write the `simplifyFundName` function with tests

**Files:**
- Modify: `src/lib/format.ts` (add function at bottom)
- Modify: `src/lib/__tests__/format.test.ts` (add test suite)

**Step 1: Write the failing tests**

Add to `src/lib/__tests__/format.test.ts`:

```typescript
import { simplifyFundName } from "../format";

describe("simplifyFundName", () => {
  it("simplifies 'Fondo de Inversión Colectiva' to FIC", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA ABIERTO SIN PACTO DE PERMANENCIA OCCITESOROS"))
      .toBe("FIC OCCITESOROS");
  });

  it("simplifies 'Fondo de Capital Privado' to FCP", () => {
    expect(simplifyFundName("FONDO DE CAPITAL PRIVADO PACTIA INMOBILIARIO"))
      .toBe("FCP PACTIA Inmob.");
  });

  it("simplifies 'Cartera Colectiva' to CC", () => {
    expect(simplifyFundName("CARTERA COLECTIVA ABIERTA CON PACTO DE PERMANENCIA EFECTIVO A PLAZOS - CARTERA CON COMPARTIMENTOS"))
      .toBe("CC EFECTIVO A PLAZOS");
  });

  it("removes pacto de permanencia phrases", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA ABIERTO CON PACTO DE PERMANENCIA ALTARENTA"))
      .toBe("FIC ALTARENTA");
  });

  it("shortens Compartimento to Comp.", () => {
    expect(simplifyFundName("FCP STATUM COMPARTIMIENTO I"))
      .toBe("FCP STATUM Comp. I");
  });

  it("shortens (EN LIQUIDACIÓN) to (Liq.)", () => {
    expect(simplifyFundName("FCP VALOR FORESTAL CAUCHO 8 (EN LIQUIDACIÓN)"))
      .toBe("FCP VALOR FORESTAL CAUCHO 8 (Liq.)");
  });

  it("shortens Inmobiliario to Inmob.", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA INMOBILIARIO SIRENTA"))
      .toBe("FIC Inmob. SIRENTA");
  });

  it("shortens Infraestructura to Infra", () => {
    expect(simplifyFundName("FCP DEUDA INFRAESTRUCTURA COLOMBIA"))
      .toBe("FCP DEUDA Infra COLOMBIA");
  });

  it("shortens Internacional to Intl.", () => {
    expect(simplifyFundName("FONDO DE INVERSIÓN COLECTIVA DIVERSIFICADO INTERNACIONAL"))
      .toBe("FIC DIVERSIFICADO Intl.");
  });

  it("handles F.I.C. prefix", () => {
    expect(simplifyFundName("F.I.C. ABIERTA CON PACTO DE PERMANENCIA SOSTENIBLE GLOBAL"))
      .toBe("FIC SOSTENIBLE GLOBAL");
  });

  it("handles F.C.P. prefix", () => {
    expect(simplifyFundName("F.C.P. VID COMPARTIMENTO II JIDUSH"))
      .toBe("FCP VID Comp. II JIDUSH");
  });

  it("handles mid-name FIC (RENDIR pattern)", () => {
    expect(simplifyFundName("RENDIR FONDO DE INVERSION COLECTIVA ABIERTO"))
      .toBe("FIC RENDIR");
  });

  it("leaves already short names unchanged", () => {
    expect(simplifyFundName("BTG PACTUAL DINAMICO"))
      .toBe("BTG PACTUAL DINAMICO");
  });

  it("handles FONDO CERRADO pattern", () => {
    expect(simplifyFundName("FONDO CERRADO INMOBILIARIO ALIANZA"))
      .toBe("FIC Inmob. ALIANZA");
  });

  it("handles FONDO BURSÁTIL pattern", () => {
    expect(simplifyFundName("FONDO BURSÁTIL ISHARES  MSCI COLCAP"))
      .toBe("FIC Bursátil ISHARES MSCI COLCAP");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/format.test.ts`
Expected: FAIL — `simplifyFundName` is not exported

**Step 3: Implement `simplifyFundName` in `src/lib/format.ts`**

Add at the bottom of `src/lib/format.ts`:

```typescript
export function simplifyFundName(name: string): string {
  let s = name;

  // Core type replacements
  s = s.replace(/FONDO DE CAPITAL PRIVADO/gi, "FCP");
  s = s.replace(/FONDO CAPITAL PRIVADO/gi, "FCP");
  s = s.replace(/FONDO DE INVERSI[OÓ]N\s+COLECTIVA/gi, "FIC");
  s = s.replace(/FONDO DE INVERSION\s+COLECTIVA/gi, "FIC");
  s = s.replace(/FONDO DE INVERSION\s+COLECTA/gi, "FIC");
  s = s.replace(/CARTERA COLECTIVA/gi, "CC");

  // Remove pacto/permanencia phrases
  s = s.replace(/\s+SIN\s+PACTO\s+DE\s+PERMANENCIA/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+DE\s+PERMANENCIA\s+RENOVABLE/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+DE\s+PERMANENCIA/gi, "");
  s = s.replace(/\s+CON\s+PACTO\s+PERMANENCIA/gi, "");

  // Remove ABIERTO/ABIERTA (default type, redundant)
  s = s.replace(/\bABIERTA?\b/gi, "");

  // CERRADO -> keep as marker
  s = s.replace(/\bCERRADA?\b/gi, "Cerrado");

  // Compartimento shortening
  s = s.replace(/SUBCOMPARTIMENTO/gi, "Subcomp.");
  s = s.replace(/COMPARTIMIENTOS/gi, "Comp.");
  s = s.replace(/COMPARTIMENTOS/gi, "Comp.");
  s = s.replace(/COMPARTIMIENTO/gi, "Comp.");
  s = s.replace(/COMPARTIMENTO/gi, "Comp.");
  s = s.replace(/COMPATIMENTO/gi, "Comp.");
  s = s.replace(/\bCOMPART\./gi, "Comp.");

  // (EN LIQUIDACIÓN) -> (Liq.)
  s = s.replace(/\(EN LIQUIDACI[OÓ]N\)/gi, "(Liq.)");
  s = s.replace(/EN LIQUIDACI[OÓ]N/gi, "(Liq.)");
  s = s.replace(/EN LIQUIDACION/gi, "(Liq.)");

  // Remove filler
  s = s.replace(/\s+DENOMINADO\s+/gi, " ");
  s = s.replace(/\s*-\s*CARTERA CON Comp\./gi, "");
  s = s.replace(/\s*- CARTERA CON COMPARTIMENTOS/gi, "");

  // Standalone FONDO patterns
  s = s.replace(/^FONDO BURS[AÁ]TIL/gi, "FIC Bursátil");
  s = s.replace(/^FONDO DE CO-INVERSI[OÓ]N/gi, "FCP Co-Inv.");
  s = s.replace(/^FONDO DE DEUDA SENIOR PARA INFRAESTRUCTURA/gi, "FCP Deuda Sr. Infra");
  s = s.replace(/^FONDO DE INFRAESTRUCTURA/gi, "FCP Infra");
  s = s.replace(/^FONDO Cerrado INMOBILIARIO/gi, "FIC Inmob.");
  s = s.replace(/^FONDO Cerrado SENTENCIAS/gi, "FIC Cerrado Sent.");
  s = s.replace(/^FONDO Cerrado/gi, "FIC Cerrado");
  s = s.replace(/^FONDO BLACKROCK/gi, "FCP Blackrock");
  s = s.replace(/^FONDO ASHMORE/gi, "FCP Ashmore");
  s = s.replace(/^FONDO NAZCA/gi, "FCP Nazca");
  s = s.replace(/^FONDO MERCADO/gi, "FCP Mercado");
  s = s.replace(/^FONDO DE CAPITAL\b/gi, "FCP");
  s = s.replace(/^FONDO CASH/gi, "FIC Cash");
  s = s.replace(/^FONDO ALIANZA/gi, "FIC Alianza");
  s = s.replace(/^FONDO DE INVERSION\b/gi, "FIC");
  s = s.replace(/^FONDO RENTA/gi, "FIC Renta");
  s = s.replace(/^FONDO\b/gi, "FIC");

  // Word-level shortening
  s = s.replace(/INMOBILIARIO/gi, "Inmob.");
  s = s.replace(/INMOBILIARIA/gi, "Inmob.");
  s = s.replace(/INMOBILIARIAS/gi, "Inmob.");
  s = s.replace(/INFRAESTRUCTURA/gi, "Infra");
  s = s.replace(/INTERNACIONAL/gi, "Intl.");

  // Handle mid-name FIC (e.g. "RENDIR FIC ABIERTO" -> "FIC RENDIR")
  if (!/^(FIC|FCP|F\.I\.C|F\.C\.P|CC)/i.test(s)) {
    const ficIdx = s.indexOf("FIC");
    if (ficIdx > 0) {
      const before = s.substring(0, ficIdx).trim();
      let after = s.substring(ficIdx + 3).trim();
      s = "FIC " + before + (after ? " " + after : "");
    }
  }

  // Normalize prefix dots
  s = s.replace(/^F\.I\.C\.\s*A\.\s*/g, "FIC ");
  s = s.replace(/^F\.I\.C\.\s*/g, "FIC ");
  s = s.replace(/^F\.C\.P\.\s*/g, "FCP ");
  s = s.replace(/^FCP\.\s*/g, "FCP ");

  // Remove double prefixes
  s = s.replace(/^FIC\s+FIC\b/gi, "FIC");
  s = s.replace(/^FCP\s+FCP\b/gi, "FCP");

  // Remove redundant phrases inside names
  s = s.replace(/CON EL FONDO DE/gi, "");
  s = s.replace(/DEL FONDO DE/gi, "");

  // Clean up whitespace
  s = s.replace(/\s+/g, " ").trim();

  return s;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/format.test.ts`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add src/lib/format.ts src/lib/__tests__/format.test.ts
git commit -m "feat: add simplifyFundName function for mobile-friendly display"
```

---

### Task 2: Update all display locations to use `simplifyFundName`

Every place that calls `toSentenceCase(fund.nombrePatrimonio)` should become `toSentenceCase(simplifyFundName(fund.nombrePatrimonio))`.

**Files to modify:**

1. **`src/components/ranking-table.tsx:263`** — ranking table fund name
2. **`src/app/ranking-client.tsx:115`** — comparison bar selection
3. **`src/app/fondo/[codigoNegocio]/detail-client.tsx:29`** — fund detail page H1
4. **`src/app/comparar/comparar-client.tsx:225`** — comparison fund card name
5. **`src/components/comparison-table.tsx:83`** — comparison table header
6. **`src/lib/generate-comparison-pdf.ts:265,373,477`** — PDF generation
7. **`src/components/fund-search-modal.tsx:83`** — search results display

**Step 1: Update each file**

For each file:
- Add `simplifyFundName` to the import from `@/lib/format` (or `./format` for `generate-comparison-pdf.ts`)
- Wrap each `fund.nombrePatrimonio` display in `simplifyFundName()` before `toSentenceCase()`

**Specific changes:**

`ranking-table.tsx:7` — add import:
```typescript
import { formatCOP, formatCompactCOP, toSentenceCase, simplifyFundName } from "@/lib/format";
```
`ranking-table.tsx:263`:
```typescript
{toSentenceCase(simplifyFundName(fund.nombrePatrimonio))}
```

`ranking-client.tsx:9` — add import:
```typescript
import { formatDate, toSentenceCase, simplifyFundName } from "@/lib/format";
```
`ranking-client.tsx:115`:
```typescript
return fund ? { id, name: toSentenceCase(simplifyFundName(fund.nombrePatrimonio)) } : null;
```

`detail-client.tsx:8` — add import:
```typescript
import { formatNumber, formatCompactCOP, formatDate, formatCOP, toSentenceCase, simplifyFundName } from "@/lib/format";
```
`detail-client.tsx:29`:
```typescript
{toSentenceCase(simplifyFundName(latest.nombrePatrimonio))}
```

`comparar-client.tsx:7` — add import:
```typescript
import { toSentenceCase, simplifyFundName } from "@/lib/format";
```
`comparar-client.tsx:225`:
```typescript
{toSentenceCase(simplifyFundName((fundNames.get(id) ?? id).slice(0, 60)))}
```
(Increase slice to 60 since the simplified name is already shorter.)

`comparison-table.tsx` — add import and line 83:
```typescript
import { formatCOP, formatCompactCOP, toSentenceCase, simplifyFundName } from "@/lib/format";
// line 83:
{toSentenceCase(simplifyFundName(fund.nombrePatrimonio))}
```

`generate-comparison-pdf.ts:4-9` — add import:
```typescript
import { formatCOP, formatCompactCOP, formatNumber, toSentenceCase, simplifyFundName } from "./format";
```
Lines 265, 373, 477 — wrap `fundNames.get()` / `fund.nombrePatrimonio` with `simplifyFundName()`.

`fund-search-modal.tsx` — add import and line 83:
```typescript
import { toSentenceCase, simplifyFundName } from "@/lib/format";
// line 83:
{toSentenceCase(simplifyFundName(fund.nombrePatrimonio))}
```

**Step 2: Verify build**

Run: `npx next build` or `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/ranking-table.tsx src/app/ranking-client.tsx \
  src/app/fondo/\[codigoNegocio\]/detail-client.tsx \
  src/app/comparar/comparar-client.tsx src/components/comparison-table.tsx \
  src/lib/generate-comparison-pdf.ts src/components/fund-search-modal.tsx
git commit -m "feat: display simplified fund names across all UI components"
```

---

### Task 3: Update search to match against both original and simplified names

**Files:**
- Modify: `src/app/ranking-client.tsx:66-69` (ranking page search)
- Modify: `src/components/fund-search-modal.tsx:37-44` (comparison search modal)

**Step 1: Update ranking search logic**

`ranking-client.tsx:64-71` — change to:

```typescript
if (search) {
  const q = search.toLowerCase();
  result = result.filter(
    (f) =>
      f.nombrePatrimonio.toLowerCase().includes(q) ||
      simplifyFundName(f.nombrePatrimonio).toLowerCase().includes(q) ||
      f.nombreEntidad.toLowerCase().includes(q)
  );
}
```

**Step 2: Update fund search modal logic**

`fund-search-modal.tsx` — add import and update filter:

```typescript
import { toSentenceCase, simplifyFundName } from "@/lib/format";
```

Lines 38-44:
```typescript
const results = allFunds
  .filter(
    (f) =>
      !excludeIds.includes(f.codigoNegocio) &&
      (f.nombrePatrimonio.toLowerCase().includes(q) ||
        simplifyFundName(f.nombrePatrimonio).toLowerCase().includes(q) ||
        f.nombreEntidad.toLowerCase().includes(q))
  )
  .slice(0, 8);
```

**Step 3: Verify build**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/ranking-client.tsx src/components/fund-search-modal.tsx
git commit -m "feat: search matches both original and simplified fund names"
```

---

### Task 4: Manual verification

**Step 1:** Run `npm run dev` and check:
- Ranking page: fund names show simplified versions
- Search: typing "Occitesoros" or "Fondo de Inversión Colectiva" both find the fund
- Fund detail: H1 shows simplified name
- Comparison page: cards and table show simplified names
- PDF export: simplified names in PDF

**Step 2:** Final commit if any fixes needed.
