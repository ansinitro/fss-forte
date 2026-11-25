import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CompassGuideProvider } from "@/components/onboarding/StudentCompassTour";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forte Compass — Астана мектеп оқушылары мен талапкерлерге арналған компас",
  description: "Forte Compass — мектеп оқушылары мен талапкерлерге мамандық таңдауға, колледждер мен университеттерді табуға және гранттарды есептеуге арналған компас.",
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
    <html lang="kk" className={openSans.variable}>
      <body className={`${openSans.className} min-h-screen flex flex-col bg-[#F7F6F6] text-[#1D1D1D] antialiased selection:bg-[#FBE4EF] selection:text-[#A31551]`}>
        <I18nProvider>
          <CompassGuideProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CompassGuideProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
