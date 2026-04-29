import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "DBYTE Infra Reports — Infrastructure & DevOps Analytics",
  description: "Portal centralizado de reportes de infraestructura AWS. Análisis de capacidad, preparación HotSale, auditorías técnicas y reportes ejecutivos.",
  openGraph: {
    title: "DBYTE Infra Reports — Infrastructure & DevOps Analytics",
    description: "Portal centralizado de reportes de infraestructura AWS",
    type: "website",
    url: "https://infra-reports.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
