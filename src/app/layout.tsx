import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhoPay – Spin it. Roll it. You pay it!",
  description:
    "The most fun and unfair way to decide who pays the bill. Spin the wheel or roll the 3D dice — multiple game modes, dark mode, troll corner & more!",
  icons: { icon: "/logos/whopayLogo.svg" },
};

// Inline script injected before first paint to prevent dark-mode flash
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Prevents dark-mode flash on reload */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Nunito', 'Poppins', sans-serif" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
