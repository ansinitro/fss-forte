import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Болашағыңды таңда — Астана қаласының ресми білім және грант платформасы",
  description: "Астана мектеп оқушылары мен талапкерлеріне арналған тексерілген білім, грант және даму жолдары. Мамандық таңда. Грант тап. Мүмкіндіктеріңді аш.",
  keywords: ["Астана", "гранттар", "ҰБТ", "мамандық таңдау", "колледждер", "университеттер", "Astana IT University", "ЕНУ", "Tech Orda"],
  openGraph: {
    title: "Болашағыңды таңда — Астана білім платформасы",
    description: "Мамандық таңда. Грант тап. Мүмкіндіктеріңді аш.",
    locale: "kk_KZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
