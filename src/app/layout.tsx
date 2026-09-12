import type { Metadata, Viewport } from "next";
import { Lora, DM_Sans, Caveat, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LearnerSearchProvider } from "@/components/search/LearnerSearchProvider";
import { cookies } from "next/headers";
import { APP_DESCRIPTION, APP_NAME, APP_SHORT_NAME } from "@/lib/brand";

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

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_SHORT_NAME,
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
  maximumScale: 1,
  userScalable: false,
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
                  var d = document.documentElement;
                  // Suppress transitions during hydration
                  d.classList.add('theme-hydrating');

                  var theme = localStorage.getItem('class-companion-theme');
                  if (!theme) {
                    var cookieMatch = document.cookie.match(/(?:^|; )class-companion-theme=([^;]+)/);
                    theme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                  }
                  if (theme === 'dark' || (theme !== 'light' && theme !== 'dark' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    d.classList.add('dark');
                    d.setAttribute('data-theme', 'dark');
                  } else {
                    d.classList.remove('dark');
                    d.setAttribute('data-theme', 'light');
                  }

                  // Remove hydration class after first paint
                  requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                      d.classList.remove('theme-hydrating');
                    });
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${lora.variable} ${dmSans.variable} ${caveat.variable} ${atkinson.variable} antialiased`}
      >
        <ThemeProvider>
          <LearnerSearchProvider>{children}</LearnerSearchProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
