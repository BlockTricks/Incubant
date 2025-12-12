import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StacksProvider } from "@/components/StacksProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incubant - Decentralized Startup Incubation Platform",
  description: "Where Ideas Meet Capital, Transparently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                  const root = document.documentElement;
                  // Explicitly remove dark class first
                  root.classList.remove('dark');
                  // Then add it only if theme is dark
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  }
                  // Ensure it's removed for light theme
                  if (theme === 'light') {
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  // If localStorage fails, default to light
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <StacksProvider>{children}</StacksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
