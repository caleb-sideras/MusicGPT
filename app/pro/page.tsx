import React from 'react'
import Pro from '@/components/Features/Pro'
import Instructions from '@/app/pro/_components/Instructions'
import Link from 'next/link'
import Head from 'next/head';
import Playback from './_components/Playback';

export default function ProHome() {
    return (
        <>
            <Head>
                <title>MusicGPT Pro</title>
                <meta name="description" content="Real-time, dedicated, technical analysis." />
                <meta name="keywords" content="musicgpt, gpt, ai, music, songs, pro" />
                <meta property="og:title" content="MusicGPT Pro" />
                <meta property="og:description" content="Real-time, dedicated, technical analysis." />
                <meta property="og:image" content="https://www.music-gpt.vercel.app/musicgptpro.png" />
            </Head>
            <div className="flex flex-col gap-4 sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto mt-4">
                <Pro />
                <Instructions />
                <Link href='/pro/chat'>
                    <div className='w-full p-4 text-center text-on-surface hover:text-surface rounded-full bg-surface hover:bg-on-surface border-on-surface hover:border-surface border-2 transition cursor-pointer'>
                        Let&apos;s go
                    </div>
                </Link>
            </div>
        </>
    )
}