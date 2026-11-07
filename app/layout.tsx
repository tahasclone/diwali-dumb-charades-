import type { Metadata, Viewport } from "next";
import { DM_Sans, Gloock, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock", display: "swap" });
const dmSans = DM_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-tiro", display: "swap" });

export const metadata: Metadata = {
  title: "Diwali Dumb Charades",
  description: "A Hindi / English dumb charades game for Diwali night: make teams, start the timer, act out the words.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#13215f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${gloock.variable} ${dmSans.variable} ${tiro.variable}`}>
      <body>{children}</body>
    </html>
  );
}
