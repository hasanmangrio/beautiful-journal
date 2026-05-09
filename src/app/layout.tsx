import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Daily — My Journal",
  description: "A personal journal, published like a magazine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${jakarta.variable} ${playfair.variable} ${bebas.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer
          className="py-8 mt-16"
          style={{ borderTop: '1.5px solid var(--border)' }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <span className="font-display text-2xl" style={{ color: 'var(--ink)' }}>
              The Daily<span style={{ color: 'var(--mint-dark)' }}>.</span>
            </span>
            <span className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
              A life, published.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
