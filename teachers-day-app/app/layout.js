import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '600', '800', '900'] });

export const metadata = { title: "Teacher's Day Appreciation", description: 'Send a thank-you card to your teacher.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased text-stone-800`}>{children}</body>
    </html>
  );
}
