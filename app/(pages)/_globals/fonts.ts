import { Plus_Jakarta_Sans, DM_Sans, DM_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const dm_sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const dm_mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
});

const fonts = [jakarta, dm_sans, dm_mono];

const font_variables = fonts.map((font) => font.variable);
const font_string = font_variables.join(' ');
export default font_string;
