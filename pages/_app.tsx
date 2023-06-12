import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { HiddenDataProvider } from "@/utils/context/song_data_context";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <ClerkProvider {...pageProps}>
      <HiddenDataProvider>
        <div className={`flex flex-col min-h-screen  ${inter.className}`}>

          <header>
            <Navbar />
          </header>

          <main className="flex-grow">
            <Component {...pageProps} />
          </main>

          <Footer />
          
        </div>
      </HiddenDataProvider>
    </ClerkProvider>
  );
}
