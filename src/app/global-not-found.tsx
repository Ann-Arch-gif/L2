import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NotFoundContent } from "@/components/NotFoundContent";
import { site } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Shown for any URL that matches no page (the normal layout lives under /[lang]).
export const metadata: Metadata = {
  title: `404 · ${site.name}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <header className="mx-auto flex h-18 max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" aria-label={site.name}>
            <Logo name={site.name} logo={site.logo} />
          </Link>
        </header>
        <main>
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
