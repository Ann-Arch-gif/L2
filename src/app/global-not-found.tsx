import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NotFoundContent } from "@/components/NotFoundContent";
import { fontVariables } from "@/lib/fonts";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

// Shown for any URL that matches no page (the normal layout lives under /[lang]).
export const metadata: Metadata = {
  title: `404 · ${SITE_NAME}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <header className="border-b border-line">
          <div className="container-x flex h-20 items-center">
            <Link href="/" aria-label={SITE_NAME}>
              <Logo />
            </Link>
          </div>
        </header>
        <main>
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
