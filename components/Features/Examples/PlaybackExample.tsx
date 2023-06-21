"use client";

import Waveform from '@/components/Icons/waveform';
import { getAudio, getMidi } from '@/utils/utils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AudioPlayer = dynamic(() => import('@/components/MusicPlayer/AudioPlayer'), {
    ssr: false,
    loading: () =>
        <div className='w-full justify-center flex'>
            <Waveform height={40} width={75} />
        </div>
})
const MidiPlayer = dynamic(() => import('@/components/MusicPlayer/MidiPlayer'), {
    ssr: false,
    loading: () =>
        <div className='w-full justify-center flex'>
            <Waveform height={40} width={75} />
        </div>
})

export default function PlaybackExample() {

    const [audio, setAudio] = useState<ArrayBuffer>()
    const [midi, setMidi] = useState<any>()

    useEffect(() => {
        const getData = async () => {
            const audioData = getAudio()
            const midiData = getMidi()

            const [audio, midi] = await Promise.all([audioData, midiData])
            setAudio(audio)
            setMidi(midi)
        }
        getData()
    }, [])

    return <>
        {
            audio && <AudioPlayer
                file={audio}
                startTime={0}
                finishTime={20}
                background={false}
            />
        }
        {
            midi && <MidiPlayer
                data={midi.data as number[]}
                soundFont=""
                loop={true}
                background={false}
            />
        }

    </>
}