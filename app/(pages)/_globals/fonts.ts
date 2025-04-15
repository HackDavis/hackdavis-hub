import {
  Inter,
  Montserrat,
  Plus_Jakarta_Sans,
  DM_Sans,
  DM_Mono,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const dm_sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dm_mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: "300",
});

const fonts = [inter, montserrat, jakarta, dm_sans, dm_mono];

const font_variables = fonts.map((font) => font.variable);
const font_string = font_variables.join(" ");
export default font_string;
