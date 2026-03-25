import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mific — Fondos de Inversión Colectiva en Colombia",
  description:
    "Compara fondos de inversión colectiva en Colombia. Ranking, detalle y comparador visual con datos de la Superintendencia Financiera.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
