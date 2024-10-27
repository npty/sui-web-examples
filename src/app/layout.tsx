import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css";
import Provider from "@/components/provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sui ITS Examples",
  description: "Sui ITS Examples by Axelar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1">
              <Navbar />
              <div className="flex flex-1 flex-wrap">
                <Sidebar />
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
