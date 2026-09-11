import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import { LanguageProvider } from "../components/LanguageProvider";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://18padel.es"),
  title: "18 | Padel Community Barcelona",
  description: "18 is a Barcelona padel community for matches, competition and connection.",
  applicationName: "18",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "18 | Padel Community Barcelona",
    description: "Padel community in Barcelona.",
    url: "/",
    siteName: "18",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "18 | Padel Community Barcelona",
    description: "Padel community in Barcelona.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <ServiceWorkerRegistration />
          <div className="pb-24">{children}</div>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
