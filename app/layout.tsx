import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth-context";
import { ProfileProvider } from "@/lib/profile-context";
import { APP_NAME } from "@/lib/config";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} · One link for everything`, template: `%s · ${APP_NAME}` },
  description: "A minimal link-in-bio page. Your socials and links, one clean page.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${bricolage.variable} bg-neutral-50 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <AuthProvider>
          <ProfileProvider>
            <Navbar />
            {children}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
