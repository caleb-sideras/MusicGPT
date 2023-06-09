import { Lite, Pro, General } from '@/components/Features/Features';
import Head from 'next/head';
import React from 'react';


export default function Chat() {
    const inlineStyles = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    const introStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pic1.png')"
    }
    const proStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pro.png')"
    }
    const liteStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_lite.png')"
    }

    return (
        <>
            <Head>
                <title>MusicGPT</title>
                <meta name="description" content="Explore, understand, and discuss music like never before with our mutimodal AI." />
                <meta name="keywords" content="musicgpt, gpt, ai, music, songs" />
                <meta property="og:title" content="MusicGPT" />
                <meta property="og:description" content="Explore, understand, and discuss music like never before with our mutimodal AI." />
                <meta property="og:image" content="http://music-gpt.xyz/musicgpt.png" />
            </Head>
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 grid- lg:gap-4 gap-y-4">
                    <div style={introStyles} className="flex md:flex-row flex-col col-span-1 md:col-span-2 lg:col-span-10 rounded-lg justify-space-between gap-4 p-4 lg:p-16 text-on-surface w-full h-fill">
                        <General />
                    </div>

                    <div style={liteStyles} className="col-span-1 md:col-span-2 lg:col-span-4 rounded-lg p-4 w-full h-fill">
                        <Lite />
                    </div>

                    <div style={proStyles} className="col-span-1 md:col-span-2 lg:col-span-6 rounded-lg p-4 w-full h-fill">
                        <Pro />
                    </div>
                </div>
            </div>
        </>
    )
}