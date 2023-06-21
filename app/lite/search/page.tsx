"use client";

import { useState } from 'react';
import Head from 'next/head'
import { GeniusSearchApiResponse } from '@/types';
import SearchBar from './_components/SearchBar';
import SongResults from './_components/SongResults';

const SearchComponent = () => {
    const [data, setData] = useState<GeniusSearchApiResponse | null>(null);

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
            <div className="container mx-auto max-w-screen-sm flex flex-col justify-center sm:px-10 px-2 mt-4">
                <SearchBar data={data} setData={setData} />
                <SongResults data={data} />
            </div>

        </>
    );
};

export default SearchComponent;