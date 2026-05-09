import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
    <html lang="en" className="h-full">
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
