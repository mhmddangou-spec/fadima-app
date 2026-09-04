import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FADIMA — Gestion simple pour les petits business africains",
    template: "%s | FADIMA",
  },
  description:
    "Gérez vos ventes, dépenses, dettes et stocks simplement depuis votre téléphone. FADIMA transforme votre business en chiffres clairs.",
  keywords: [
    "gestion business Bénin",
    "commerçant africain",
    "comptabilité simple",
    "FCFA",
    "ventes",
    "dépenses",
    "petits commerces",
    "micro-entrepreneur",
    "Cotonou",
    "Bénin",
  ],
  authors: [{ name: "FADIMA" }],
  creator: "FADIMA",
  openGraph: {
    title: "FADIMA — Ton business. Ta voix. Tes chiffres.",
    description:
      "Gérez vos ventes, dépenses, dettes et stocks simplement depuis votre téléphone.",
    type: "website",
    locale: "fr_FR",
    siteName: "FADIMA",
  },
  twitter: {
    card: "summary_large_image",
    title: "FADIMA — Gestion simple pour les petits business africains",
    description: "Gérez votre business sans calculatrice.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FADIMA",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a6b4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
        <Script src="https://checkout.fedapay.com/js/checkout.js" strategy="lazyOnload" />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) { console.log('SW registered:', reg.scope); })
                  .catch(function(err) { console.log('SW registration failed:', err); });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
