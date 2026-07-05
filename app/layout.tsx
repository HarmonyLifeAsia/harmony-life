import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = "https://newage.life";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nowa Era | Społeczność Świadomych Ludzi",
    template: "%s | Nowa Era",
  },
  description:
    "Przestrzeń dla świadomych ludzi, którzy chcą rozwijać się duchowo, budować dobrostan i tworzyć wspólnotę opartą na obecności, wsparciu i głębszym sensie.",
  keywords: [
    "Nowa Era",
    "New Age Life",
    "świadomość",
    "rozwój duchowy",
    "dobrostan",
    "wspólnota",
    "uważność",
    "conscious community",
  ],
  authors: [{ name: "Nowa Era" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "Nowa Era",
    title: "Nowa Era | Społeczność Świadomych Ludzi",
    description:
      "Przestrzeń dla świadomych ludzi, którzy chcą rozwijać się duchowo, budować dobrostan i tworzyć wspólnotę opartą na obecności, wsparciu i głębszym sensie.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nowa Era | Społeczność Świadomych Ludzi",
    description:
      "Przestrzeń dla świadomych ludzi, którzy chcą rozwijać się duchowo, budować dobrostan i tworzyć wspólnotę opartą na obecności, wsparciu i głębszym sensie.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
