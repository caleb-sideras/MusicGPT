"use client";

import { ChatMessagePro } from "@/components/Chat/ChatMessagePro"
import { getAudio, getMidi } from "@/utils/utils"
import { useEffect, useState } from "react"

export default function Playback() {
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
        <div className='sm:px-0 px-5'>
            I currently support Audio/MIDI playback with dedicated analysis. Specify a section with timestamps and ask for these features.
        </div>
        <div className='flex flex-col gap-4 mt-4 p-6 bg-on-surface rounded-lg'>
            <ChatMessagePro message={
                {
                    role: 'user',
                    parts: [
                        {
                            type: 'text',
                            content: "I want to hear the Audio and MIDI from 35-55 seconds"
                        }

                    ]
                }
            } />
            {audio && midi && <ChatMessagePro message={
                {
                    role: 'assistant',
                    parts: [
                        {
                            type: 'text',
                            content: 'Here is your Audio playback'

                        },
                        {
                            type: 'audi',
                            content: { file: audio, start: 0, end: 20 }
                        },
                        {
                            type: 'text',
                            content: 'And here is your MIDI playback'

                        },
                        {
                            type: 'midi',
                            content: midi.data as number[]
                        }
                    ]
                }

            } />
            }
        </div>
    </>

}