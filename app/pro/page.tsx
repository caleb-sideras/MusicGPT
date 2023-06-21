import React from 'react'
import Pro from '@/components/Features/Pro'
import Instructions from '@/app/pro/_components/Instructions'
import Link from 'next/link'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pro',
    description: 'Real-time, dedicated, technical analysis.',
    openGraph: {
        title: 'MusicGPT Pro',
        description: 'Real-time, dedicated, technical analysis.',
        url: 'https://music-gpt.xyz/pro',
        images: [
            {
                url: 'http://music-gpt.xyz/musicgptpro.png',
                width: 800,
                height: 540,
                alt: 'MusicGPT Pro Info',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MusicGPT Pro',
        description: 'Real-time, dedicated, technical analysis.',
        images: ['http://music-gpt.xyz/musicgptpro.png'],
    },

};

export default function ProHome() {
    return (
        <div className="flex flex-col gap-4 sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto mt-4">
            <Pro />
            <Instructions />
            <Link href='/pro/chat'>
                <div className='w-full p-4 text-center text-on-surface hover:text-surface rounded-full bg-surface hover:bg-on-surface border-on-surface hover:border-surface border-2 transition cursor-pointer'>
                    Let&apos;s go
                </div>
            </Link>
        </div>
    )
}