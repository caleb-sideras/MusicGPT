import Link from 'next/link';
import React from 'react'
import Lite from '@/components/Features/Lite';
import SongExample from './_components/SongExample';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lite',
    description: 'Musical, Lyrical & Cultural analysis.',
    openGraph: {
        title: 'MusicGPT Lite',
        description: 'Musical, Lyrical & Cultural analysis.',
        url: 'https://music-gpt.xyz/lite',
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
        title: 'MusicGPT Lite',
        description: 'Musical, Lyrical & Cultural analysis.',
        images: ['http://music-gpt.xyz/musicgptlite.png'],
    },

};

export default function LiteHome() {

    return (
        <div className="flex flex-col gap-4 sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto mt-4">
            <Lite />
            <SongExample />
            <Link href='/lite/search'>
                <div className='w-full p-4 text-center text-secondary hover:text-surface rounded-full bg-surface hover:bg-secondary border-secondary hover:border-surface border-2 transition cursor-pointer'>
                    Search
                </div>
            </Link>
        </div>
    )
}