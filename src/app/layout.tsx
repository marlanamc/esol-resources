import type { Metadata, Viewport } from "next";
import { Lora, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from "next/headers";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Class Companion - ESOL Learning Hub",
  description:
    "An interactive classroom companion for ESOL students and teachers. Practice grammar, build vocabulary, compete with classmates, and track your progress.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Class Companion",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#d97757",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("class-companion-theme")?.value;
  const htmlClassName = savedTheme === "dark" ? "dark" : undefined;
  const htmlTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={htmlClassName}
      data-theme={htmlTheme}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('class-companion-theme');
                  if (!theme) {
                    var cookieMatch = document.cookie.match(/(?:^|; )class-companion-theme=([^;]+)/);
                    theme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                  }
                  if (theme === 'dark' || (theme !== 'light' && theme !== 'dark' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${lora.variable} ${dmSans.variable} ${caveat.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
