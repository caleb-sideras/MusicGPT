import { Metadata } from 'next';
import Search from './_components/Search';

export const metadata: Metadata = {
    title: 'Lite Search',
    description: 'Search for a song to discuss with MusicGPT Lite.',
    openGraph: {
        title: 'MusicGPT Lite Search',
        description: 'Search for a song to discuss with MusicGPT Lite.',
        url: 'https://music-gpt.xyz/lite/search',
        images: [
            {
                url: 'http://music-gpt.xyz/musicgptlite.png',
                width: 794,
                height: 442,
                alt: 'MusicGPT Pro Info',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MusicGPT Lite Search',
        description: 'Search for a song to discuss with MusicGPT Lite.',
        images: ['http://music-gpt.xyz/musicgptlite.png'],
    },

};
export default function SearchComponent() {

    return (
        <div className="container mx-auto max-w-screen-sm flex flex-col justify-center sm:px-10 px-2 mt-4">
            <Search />
        </div>
    );
};