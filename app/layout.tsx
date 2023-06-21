import { Footer } from '@/components/Layout/Footer';
import { Navbar } from '@/components/Layout/Navbar';
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import '../styles/globals.css';
import { HiddenDataProvider } from '@/utils/context/song_data_context';

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <HiddenDataProvider>
        <html lang="en">
          <body className={`background flex flex-col min-h-screen  ${inter.className}`}>
            <nav>
              <Navbar />
            </nav>
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