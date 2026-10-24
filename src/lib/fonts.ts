import { DM_Sans, Fraunces, Kantumruy_Pro } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "opsz"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer"], variable: "--font-kantumruy" });

export const fontVariables = `${fraunces.variable} ${dmSans.variable} ${kantumruy.variable}`;
