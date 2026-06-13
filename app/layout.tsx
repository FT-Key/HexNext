import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s - HexNext",
    default: "HexNext - Tienda de Tecnología Informática",
  },
  description:
    "Componentes de PC, periféricos, sillas gamer y accesorios. Armá tu PC con validación de compatibilidad automática.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", "font-sans", figtree.variable)}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
