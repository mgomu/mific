"use client";

import { Suspense } from "react";
import { CompararClient } from "./comparar-client";

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="pt-24 px-8 text-center">Cargando...</div>}>
      <CompararClient />
    </Suspense>
  );
}
