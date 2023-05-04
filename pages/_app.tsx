import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { HiddenDataProvider } from "@/utils/context/song_data_context";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps<{}>) {
  // <nav className="bg-primary p-4">
  //           <a href="/" className="text-on-primary">Home</a>
  //           {/* Add more links as needed */}
  //         </nav>
  return (
    <HiddenDataProvider>
      <div className={`background flex flex-col gap-4 min-h-screen ${inter.className}`}>
        
        <header>
          <Navbar />
        </header>

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </HiddenDataProvider>
  );
}
