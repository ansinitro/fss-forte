import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { CompassGuideProvider } from "@/components/onboarding/StudentCompassTour";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { QRWelcomeBanner } from "@/components/common/QRWelcomeBanner";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forte Compass — Навигатор для школьников и абитуриентов",
  description: "Forte Compass — интерактивный путеводитель для школьников и абитуриентов: выбор профессии, реестр 688 колледжей и 143 вузов, калькулятор грантов ЕНТ.",
  keywords: ["Forte Compass", "Астана", "гранты", "ЕНТ", "выбор профессии", "колледжи", "университеты", "Astana IT University", "ЕНУ", "Tech Orda"],
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
    title: "Forte Compass — Навигатор для школьников и абитуриентов",
    description: "Выбери профессию. Рассчитай грант. Открой свои возможности.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={openSans.variable}>
      <body className={`${openSans.className} min-h-screen flex flex-col bg-[#F7F6F6] text-[#1D1D1D] antialiased selection:bg-[#FBE4EF] selection:text-[#A31551]`}>
        <I18nProvider>
          <CompassGuideProvider>
            <Header />
            <QRWelcomeBanner />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </CompassGuideProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
