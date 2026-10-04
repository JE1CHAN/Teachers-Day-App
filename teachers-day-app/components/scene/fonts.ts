import { Fredericka_the_Great, Poppins } from "next/font/google";

// Only two families in the scene: a chalk face and a bold sans.
export const chalkFont = Fredericka_the_Great({ weight: "400", subsets: ["latin"], variable: "--font-chalk" });
export const tagFont = Poppins({ weight: "800", subsets: ["latin"], variable: "--font-tag" });