import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { GSAPProvider } from "@/providers/GSAPProvider";
import { Header } from "@/components/layout/Header";
import { Cursor } from "@/components/animation/Cursor";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // Fraunces is a variable font with an optical-size axis; widen the
  // weight range so both hero display sizes and smaller titles read
  // with the right contrast.
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Flavor Atlas — Cinematic Recipe Archive",
  description:
    "An interactive, cinematic archive of dishes from around the world, built on TheMealDB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <GSAPProvider>
              <Cursor />
              <Header />
              <main>{children}</main>
            </GSAPProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
