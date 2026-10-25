import { Cormorant_Garamond, Kantumruy_Pro, Manrope, Noto_Serif_Khmer } from "next/font/google";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
// Not preloaded: browsers fetch these only on pages that show Khmer text, so English and
// Chinese visitors skip about 140 KB of font downloads.
const khmerSans = Kantumruy_Pro({ subsets: ["khmer"], variable: "--font-kantumruy", preload: false });
const khmerSerif = Noto_Serif_Khmer({ subsets: ["khmer"], variable: "--font-khmer-serif", preload: false });

export const fontVariables = [display, sans, khmerSans, khmerSerif].map((f) => f.variable).join(" ");
