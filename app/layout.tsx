import { Metadata } from 'next';
import { Footer } from '@/components/Layout/Footer';
import { Navbar } from '@/components/Layout/Navbar';
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import '../styles/globals.css';
import { HiddenDataProvider } from '@/utils/context/song_data_context';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: {
    default: 'MusicGPT',
    template: '%s | MusicGPT',
  },
  applicationName: 'MusicGPT',
  description: 'Explore, understand, and discuss music like never before with our mutimodal AI.',
  keywords: ['MusicGPT', 'Music', 'AI'],
  authors: [{ name: 'Caleb', url: 'https://calebsideras.com' }],
  colorScheme: 'dark',
  creator: 'Caleb Sideras',
  generator: 'Next.js',
  openGraph: {
    title: 'MusicGPT',
    description: 'Explore, understand, and discuss music like never before with our mutimodal AI.',
    type: 'website',
    url: 'https://music-gpt.xyz',
    siteName: 'MusicGPT',
    images: [
      {
        url: 'http://music-gpt.xyz/musicgpt.png',
        width: 768,
        height: 423,
        alt: 'MusicGPT Info',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MusicGPT',
    description: 'Explore, understand, and discuss music like never before with our mutimodal AI.',
    creator: '@sliderass',
    images: ['http://music-gpt.xyz/musicgpt.png'],
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <HiddenDataProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
          </head>
          <body className={`background flex flex-col min-h-screen  ${inter.className}`}>
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </body>
        </html >
      </HiddenDataProvider>
    </ClerkProvider>

  )
}