import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Forte Compass — Астана мектеп оқушылары мен талапкерлерге арналған компас",
  description: "Forte Compass — мектеп оқушылары мен талапкерлерге мамандық таңдауға, Астана колледждері мен университеттерді табуға және гранттарды есептеуге арналған көмекші жүйе.",
  keywords: ["Forte Compass", "Астана", "гранттар", "ҰБТ", "мамандық таңдау", "колледждер", "университеттер", "Astana IT University", "ЕНУ", "Tech Orda"],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: "Forte Compass — Оқушылар мен талапкерлер компасы",
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
