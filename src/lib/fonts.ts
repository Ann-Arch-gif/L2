import { Cormorant_Garamond, Kantumruy_Pro, Manrope, Noto_Serif_Khmer } from "next/font/google";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const khmerSans = Kantumruy_Pro({ subsets: ["khmer"], variable: "--font-kantumruy" });
const khmerSerif = Noto_Serif_Khmer({ subsets: ["khmer"], variable: "--font-khmer-serif" });

export const fontVariables = [display, sans, khmerSans, khmerSerif].map((f) => f.variable).join(" ");
