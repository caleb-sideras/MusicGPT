import Link from 'next/link';
import Head from 'next/head';
import React from 'react'

import Lite from '@/components/Features/Lite';
import SongExample from './_components/SongExample';

function LiteHome() {

    return (
        <>
            <Head>
                <title>MusicGPT Lite</title>
                <meta name="description" content="Musical, Lyrical & Cultural analysis." />
                <meta name="keywords" content="musicgpt, gpt, ai, music, songs, lite" />
                <meta property="og:title" content="MusicGPT Lite" />
                <meta property="og:description" content="Musical, Lyrical & Cultural analysis." />
                <meta property="og:image" content="https://www.music-gpt.vercel.app/musicgptlite.png" />
            </Head>

            <div className="flex flex-col gap-4 sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto mt-4">
                <Lite />
                <SongExample />
                <Link href='/lite/search'>
                    <div className='w-full p-4 text-center text-secondary hover:text-surface rounded-full bg-surface hover:bg-secondary border-secondary hover:border-surface border-2 transition cursor-pointer'>
                        Search
                    </div>
                </Link>
            </div>
        </>
    )
}

export default LiteHome