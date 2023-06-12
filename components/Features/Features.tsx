import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Waveform from '../Icons/waveform';
import Showcase from './Showcase';
import AudioPlayer from '../MusicPlayer/AudioPlayer';
import dynamic from 'next/dynamic';
import Image from 'next/image'
import { ChatMessagePro } from '../Chat/ChatMessagePro';

const PlayerElement = dynamic(() => import('../MusicPlayer/ReactPlayer'), { ssr: false });


type ListProps = {
    title: string;
    children: string;
    section?: string;
}
const General = () => {
    const [audioFile, setAudioFile] = useState<any>()
    const [midiData, setMidiData] = useState<any>()

    useEffect(() => {
        getAudioFile()
        console.log("no, this can run many times")
    }, [])// eslint-disable-line react-hooks/exhaustive-deps


    const getAudioFile = async () => {
        try {
            const responseWav = await fetch('/JoshuaSideras.wav');
            const responseJSON = await fetch('/JoshuaSideras.json');


            if (!responseWav.ok || !responseJSON.ok) {
                throw new Error(`HTTP error!`);
            }
            const jsonBuffer = await responseJSON.json()
            setAudioFile(await responseWav.arrayBuffer())
            setMidiData(new Uint8Array(jsonBuffer.data))
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    }

    return (
        // <div className="w-full sm:w-auto rounded-md bg-tertiary p-[22px]">
        //     <div className='flex sm:flex-row flex-col justify-center text-3xl font-semibold text-center text-on-tertiary sm:mb-6 mb-4'>
        //         <span>Discover</span>
        //         <span className='text-on-tertiary font-extrabold pl-4'>MusicGPT</span>
        //     </div>
        //     <ul className="m-auto grid list-none gap-x-[10px] w-full sm:grid-cols-[0.75fr_1fr]">

        //         <li className="row-span-3 grid">
        //             <div
        //                 className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-tertiary-container p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
        //             >
        //                 <Waveform />
        //                 <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-on-tertiary-container">
        //                     MusicGPT
        //                 </div>
        //                 <p className="text-mauve4 text-[14px] leading-[1.3] text-on-tertiary-container">
        //                     AI powered music analysis.
        //                 </p>
        //             </div>
        //         </li>

        //         <ListItem title="AI">
        //             Discuss various aspects of a song in natural language.
        //         </ListItem>
        //         <ListItem title="Multi-model">
        //         MusicGPT employs a multi-model architecture, enhancing the capacity of AI to grasp and interpret musical nuances effectively.
        //         </ListItem>
        //         <ListItem title="Search">
        //             On-demand search for any song or upload your own files
        //         </ListItem>
        //     </ul>
        // </div>
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
                        <Image
                            src='/example_plot.png'
                            width={499}
                            height={427}
                            alt='Example Visualization'
                            className='m-auto'
                        />
                    </div>
                </Showcase>

                <Showcase title='Playback' description='Listen to a song in various formats'>
                    <div className='flex flex-col justify-center h-full p-2'>

                        {
                            audioFile && <AudioPlayer
                                file={audioFile}
                                startTime={0}
                                finishTime={20}
                                background={false}
                            />
                        }

                        {
                            midiData && <PlayerElement
                                buffer={midiData as Buffer}
                                soundFont=""
                                loop={true}
                                background={false}
                            />
                        }
                    </div>
                </Showcase>
                <Showcase title='Dedicated Analysis' description='Query any section of a song for dedicated analysis'>
                    <div className='flex flex-col h-full gap-4 p-2 pb-4'>

                        <ChatMessagePro message={
                            {
                                role: 'user',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "From 20-40 seconds, how do harmonies play a role in shaping the mood?"
                                    }

                                ]
                            }
                        } />
                        <ChatMessagePro message={
                            {
                                role: 'assistant',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "During this specific segment, the harmony evolves through a chord progression from C to G to Am to F. This change, popular in many songs, moves from major to minor tones, influencing the emotional mood of the piece. The shift to the F chord can provide a sense of resolution or comfort. These harmonic changes, paired with corresponding melodic variations, create a dynamic, nuanced sonic landscape."
                                    },
                                ]
                            }
                        } />
                    </div>
                </Showcase>
            </ul >
        </div >
    );
};

const Lite = () => {
    return (
        <ul className="w-full h-full m-auto rounded-md bg-secondary grid list-none gap-x-[10px] p-[22px] sm:grid-cols-[0.75fr_1fr]">
            <li className="row-span-3 grid">
                <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-secondary-container p-[25px] no-underline hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200 focus:shadow-[0_0_0_2px]"
                    href="/lite"
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
            {/* <ListItem title="Web Search">
                MusicGPT gathers all relevant information about a song from the Internet.
            </ListItem> */}
            <ListItem title="MIDI">
                Discuss a songs MIDI with MusicGPT&apos;s Polyphonic MIDI extraction.
            </ListItem>
            <ListItem title="Visualizations">
                Describe a visualization and MusicGPT will create it.
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
