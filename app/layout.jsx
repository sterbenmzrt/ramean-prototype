import "./globals.css";
import { Inter, Urbanist } from "next/font/google";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata = {
  title: "Ramean.id — Langganan Premium, Harga Terjangkau",
  description:
    "Platform patungan langganan digital dengan jaminan escrow. Netflix, Spotify, ChatGPT Plus, dan lainnya dengan harga jauh lebih hemat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${urbanist.variable}`}>
      <body className="font-body text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
