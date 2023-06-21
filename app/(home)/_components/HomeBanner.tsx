import { Suspense } from 'react';

import Showcase from './Showcase';
import { inlineStyles } from '@/types';

import PlaybackExample from '@/components/Features/Examples/PlaybackExample';
import MessageExample from '@/components/Features/Examples/MessageExample';
import ImageExample from '@/components/Features/Examples/ImageExample';

export default function HomeBanner() {

    const homeStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pic1.png')"
    }

    return (
        <div style={homeStyles} className="flex md:flex-row flex-col col-span-1 md:col-span-2 lg:col-span-10 rounded-lg justify-space-between gap-4 p-4 lg:p-16 text-on-surface w-full h-fill">
            <div className="w-full rounded-md bg-tertiary p-[22px]">
                <div className='flex sm:flex-row flex-col justify-center text-5xl font-semibold text-center text-on-tertiary sm:mb-5 mb-4'>
                    <span>Discover</span>
                    <span className='font-extrabold pl-4'>MusicGPT</span>
                </div>
                <p className="text-xl leading-[1.3] text-center text-on-tertiary">
                    Explore, understand, and discuss music like never before with our mutimodal AI
                </p>

                <ul className="m-auto grid list-none gap-[10px] w-full 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 mt-8">
                    <Showcase title='Visualizations' description='MusicGPT can create any visualization you want' >
                        <div className='flex justify-center h-full sm:mt-auto mt-2'>
                            <ImageExample />

                        </div>
                    </Showcase>

                    <Showcase title='Playback' description='Listen to a song in various formats'>
                        <div className='flex flex-col justify-center h-full p-2'>
                            <PlaybackExample />
                        </div>
                    </Showcase>

                    <Showcase title='Dedicated Analysis' description='Query any section of a song for dedicated analysis'>
                        <div className='flex flex-col h-full gap-4 p-2 pb-4'>
                            <MessageExample />
                        </div>
                    </Showcase>
                </ul >
            </div >
        </div>
    );
};
