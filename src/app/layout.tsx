import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MiFIC — Fondos de Inversión Colectiva en Colombia",
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>{children}</body>
    </html>
  );
}
