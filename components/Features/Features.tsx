import React from 'react';
import Link from 'next/link';
import Waveform from '../Icons/waveform';

type ProProps = {
    proHighlighted: boolean
}

type ListProps = {
    title: string;
    children: string;
    section?: string;
}
const General = () => {
    return (
        <div className="w-full sm:w-auto rounded-md bg-tertiary p-[22px]">
            <div className='flex sm:flex-row flex-col justify-center text-3xl font-semibold text-center text-on-tertiary sm:mb-6 mb-4'>
                <span>Discover</span>
                <span className='text-on-tertiary font-extrabold pl-4'>MusicGPT</span>
            </div>
            <ul className="m-auto grid list-none gap-x-[10px] w-full sm:grid-cols-[0.75fr_1fr]">

                <li className="row-span-3 grid">
                    <div
                        className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-tertiary-container p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
                    >
                        <Waveform />
                        <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-on-tertiary-container">
                            MusicGPT
                        </div>
                        <p className="text-mauve4 text-[14px] leading-[1.3] text-on-tertiary-container">
                            AI powered music analysis.
                        </p>
                    </div>
                </li>

                <ListItem title="AI">
                    Discuss various aspects of a song in natural language.
                </ListItem>
                <ListItem title="Multi-model">
                MusicGPT employs a multi-model architecture, enhancing the capacity of AI to grasp and interpret musical nuances effectively.
                </ListItem>
                <ListItem title="Search">
                    On-demand search for any song or upload your own files
                </ListItem>
            </ul>
        </div>
    );
};

const Lite = () => {
    return (
        <ul className="w-full h-full m-auto rounded-md bg-secondary grid list-none gap-x-[10px] p-[22px] sm:grid-cols-[0.75fr_1fr]">
            <li className="row-span-3 grid">
                <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-secondary-container p-[25px] no-underline hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200 focus:shadow-[0_0_0_2px]"
                    href="/lite/search"
                >
                    <Waveform />
                    <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-on-secondary-container">
                        MusicGPT Lite
                    </div>
                    <p className="text-mauve4 text-[14px] leading-[1.3] text-on-secondary-container">
                        Musical, Lyrical & Cultural analysis.
                    </p>
                </Link>
            </li>

            <ListItem title="Musical" section="lite">
                Discuss high & low level features capturing the general structure of the music.
            </ListItem>
            <ListItem title="Lyrics" section="lite">
                Understand the meaning behind lyrics.
            </ListItem>
            <ListItem title="Cultural" section="lite">
                Be informed about the context surrounding the music and its relevance to various topics.
            </ListItem>
        </ul>
    );
};

const Pro = () => {
    return (
        <ul className="w-full h-full m-auto rounded-md bg-inverse-surface grid list-none gap-x-[10px] p-[22px] sm:grid-cols-[0.75fr_1fr]">
            <li className="row-span-4 grid">
                <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-inverse-on-surface p-[25px] no-underline hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200 focus:shadow-[0_0_0_2px]"
                    href="/pro"
                >
                    <Waveform />
                    <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-inverse-surface">
                        MusicGPT Pro
                    </div>
                    <p className="text-mauve4 text-[14px] leading-[1.3] text-inverse-surface">
                        Real-time, dedicated, technical analysis.
                    </p>
                </Link>
            </li>
            <ListItem title="Production and Engineering">
                Discuss technical aspects of songs such as stero image, compression and more.
            </ListItem>
            <ListItem title="Web Search">
                MusicGPT gathers all relevant information about a song from the Internet.
            </ListItem>
            <ListItem title="MIDI">
                Discuss a songs MIDI with MusicGPT&apos;s Polyphonic MIDI extraction.
            </ListItem>
            <ListItem title="Upload">
                Upload your own music for analysis.
            </ListItem>
        </ul>
    );
};

const ListItem = ({ title, children, section = 'pro' }: ListProps) => (
    <div
        className={`focus:shadow-[0_0_0_2px] focus:shadow-violet7 hover:bg-mauve3 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors`}
    >
        {section === 'lite' ? (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-on-secondary">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-secondary-container">{children}</p>
            </>
        ) : section === 'pro' ? (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-inverse-on-surface">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-inverse-on-surface">{children}</p>
            </>
        ) : (
            <>
                <div className="text-violet12 mb-[5px] font-medium leading-[1.2] text-on-tertiary">
                    {title}
                </div>
                <p className="text-mauve11 leading-[1.4] text-tertiary-container">{children}</p>
            </>
        )}
    </div>
);

export { Lite, Pro, ListItem, General };
