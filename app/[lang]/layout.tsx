import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { LANGS, type Lang } from '@/lib/config';
import { getDict } from '@/lib/content';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const lang = (LANGS as readonly string[]).includes(params.lang) ? (params.lang as Lang) : 'pl';
  const t = getDict(lang);
  return {
    title: t.meta.title,
    description: t.meta.description,
    metadataBase: new URL('https://www.harmonylife.asia'),
    alternates: {
      languages: { pl: '/pl', en: '/en', de: '/de' },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: 'website',
      locale: lang,
    },
  };
}

// Skrypt ustawiający motyw przed pierwszym malowaniem (dark-first, bez migotania).
const themeInit = `(function(){try{var s=localStorage.getItem('hl-theme');var d=s? s==='dark' : true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!(LANGS as readonly string[]).includes(params.lang)) notFound();
  const lang = params.lang as Lang;
  const t = getDict(lang);

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Navbar lang={lang} t={t} />
        <main>{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
