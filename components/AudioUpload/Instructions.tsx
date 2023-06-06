import React, { ReactNode, useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ChatMessagePro } from '../Chat/ChatMessagePro';

interface AccordionItemProps {
    children: ReactNode;
    className?: string;
    value: string;
}

const AccordionDemo: React.FC = () => {

    const [audioFile, setAudioFile] = useState<any>()
    const [midiData, setMidiData] = useState<any>()

    useEffect(() => {
        getAudioFile()
        console.log("no, this can run many times")
    }, [])


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
        <Accordion.Root
            className="bg-[#e3e3e3] rounded-lg w-full "
            type="single"
            defaultValue="item-1"
            collapsible
        >

            <AccordionItem value="item-1">
                <AccordionTrigger>Dedicated Analysis</AccordionTrigger>
                <AccordionContent>
                    <div>
                        Query a specific section to get a dedicated analysis. If timestamps are not provided, I cannot perform a dedicated analysis, resulting in vague answers. I currently support up to a total of 20 seconds of dedicated analysis per message.                    </div>
                    <div className='flex flex-col gap-4 mt-4 p-6 bg-[#edf2fa] rounded-lg'>
                        <ChatMessagePro message={
                            {
                                role: 'user',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "From 20-40 seconds, how do harmonies play a role in shaping the mood and enhancing the overall sonic texture of the composition?"
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
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger>Playback</AccordionTrigger>
                <AccordionContent>
                    <div>
                        I currently support Audio/MIDI playback with dedicated analysis. Specify a section with timestamps and ask for these features.
                    </div>
                    <div className='flex flex-col gap-4 mt-4 p-6 bg-[#edf2fa] rounded-lg'>
                        {audioFile && midiData ?
                            <>
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
                                <ChatMessagePro message={
                                    {
                                        role: 'assistant',
                                        parts: [
                                            {
                                                type: 'text',
                                                content: 'Here is your Audio playback'

                                            },
                                            {
                                                type: 'audi',
                                                content: { file: audioFile, start: 35, end: 55 }
                                            },
                                            {
                                                type: 'text',
                                                content: 'And here is your MIDI playback'

                                            },
                                            {
                                                type: 'midi',
                                                content: midiData
                                            }
                                        ]
                                    }
                                } /></>
                            : <></>
                        }
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger>Visualizations</AccordionTrigger>
                <AccordionContent>
                    <div>
                        I support custom visualizations. Describe what you would like to see and I will create the code and run it for you.
                    </div>
                    <div className='flex flex-col gap-4 mt-4 p-6 bg-[#edf2fa] rounded-lg'>
                        <ChatMessagePro message={
                            {
                                role: 'user',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "Create a custom visualization to show the intensity of the notes in the first 5 seconds."
                                    }

                                ]
                            }
                        } />
                        <ChatMessagePro message={
                            {
                                role: 'assistant',
                                parts: [
                                    {
                                        type: 'code',
                                        content: "function createHPCPBarChart(hpcp, container) {\n  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];\n  const data = Array.from(hpcp);\n  const maxValue = Math.max(...data);\n\n  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n  svg.setAttribute('width', '100%');\n  svg.setAttribute('height', '100%');\n  svg.setAttribute('viewBox', '0 0 120 100');\n  container.appendChild(svg);\n\n  const barWidth = 8;\n  const barSpacing = 2;\n  const chartHeight = 8..."
                                    },
                                    {
                                        type: 'exec',
                                        content: {
                                            code: `function createHPCPBarChart(hpcp, container) {\n  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];\n  const data = Array.from(hpcp);\n  const maxValue = Math.max(...data);\n\n  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n  svg.setAttribute('width', '100%');\n  svg.setAttribute('height', '100%');\n  svg.setAttribute('viewBox', '0 0 120 100');\n  container.appendChild(svg);\n\n  const barWidth = 8;\n  const barSpacing = 2;\n  const chartHeight = 80; // assumed chartHeight value\n\n  data.forEach((value, index) => {\n    const barHeight = (value / maxValue) * chartHeight;\n    const x = index * (barWidth + barSpacing) + barSpacing;\n    const y = chartHeight - barHeight;\n\n    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');\n    rect.setAttribute("x", String(x));\n    rect.setAttribute("y", String(y));\n    rect.setAttribute('width', String(barWidth));\n    rect.setAttribute("height", String(barHeight));\n    rect.setAttribute('fill', 'white');\n    svg.appendChild(rect);\n\n    const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');\n    text.setAttribute('x', String(x + barWidth / 2));\n    text.setAttribute('y', String(chartHeight + 15));\n    text.setAttribute("text-anchor", 'middle');\n    text.setAttribute('font-size', '5');\n    text.setAttribute('fill', 'white');\n    text.textContent = notes[index];\n    svg.appendChild(text);\n  });\n}\n`,
                                            parameters: new Float32Array([
                                                0.06718692928552628,
                                                0.09429235756397247,
                                                0.22089536488056183,
                                                0.2754737436771393,
                                                0.00002110790774167981,
                                                0,
                                                0,
                                                1,
                                                0.777940034866333,
                                                0.3950446546077728,
                                                0.3153027296066284,
                                                0.033138956874608994
                                            ])
                                        }
                                    }

                                ]
                            }
                        } />
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <AccordionTrigger>Data Persistence</AccordionTrigger>
                <AccordionContent>
                    <div>
                        Due to the nature and size of the data used for dedicated analysis, I do not retain this information during our conversation. Once I&apos;ve provided a response to your query, any accumulated data is discarded. For follow-up questions you&apos;ll need to restate the relevant section/s.
                    </div>
                    <div className='flex flex-col gap-4 mt-4 p-6 bg-[#edf2fa] rounded-lg'>
                        <ChatMessagePro message={
                            {
                                role: 'user',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "Could you compare the melody present in 20-30 to 1:30-1:40?"
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
                                        content: `In the 20-30 second segment, the melody features a simple, catchy pattern that emphasizes the root notes of the underlying chord progression. It largely uses stepwise motion and stays within a relatively narrow range, creating a calm and stable feeling.\n\nIn contrast, the melody in the 1:30-1:40 segment is more complex and dynamic. It frequently jumps between different octaves and involves both ascending and descending leaps. This results in a more dramatic, energetic feel compared to the earlier segment.\n\nThese differences highlight the compositional techniques used to evoke different moods at different points in the piece.`
                                    }

                                ]
                            }
                        } />
                        <ChatMessagePro message={
                            {
                                role: 'user',
                                parts: [
                                    {
                                        type: 'text',
                                        content: "Interesting, could you compare the harmonies?"
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
                                        content: "Unfortunately, I do not have access to this data. Could you please provide the relevant time segments in your next message."
                                    }

                                ]
                            }
                        } />
                    </div>
                </AccordionContent>
            </AccordionItem>


        </Accordion.Root>
    );
};

const AccordionItem = React.forwardRef<HTMLElement, AccordionItemProps>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Accordion.Item
            className='mt-px overflow-hidden first:mt-0 first:rounded-t-lg last:rounded-b-lg focus-within:relative focus-within:z-10'
            {...props}
            //@ts-ignore
            ref={forwardedRef}
        >
            {children}
        </Accordion.Item>
    );
});
AccordionItem.displayName = 'AccordionItem'


interface AccordionTriggerProps {
    children: ReactNode;
    className?: string;
}

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Accordion.Header className="flex">
            <Accordion.Trigger
                className='text-surface hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-on-surface px-5 text-[15px] leading-none'
                {...props}
                //@ts-ignore
                ref={forwardedRef}
            >
                {children}
                <ChevronDownIcon
                    className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden />
            </Accordion.Trigger>
        </Accordion.Header>
    );
});

AccordionTrigger.displayName = 'AccordionTrigger'


interface AccordionContentProps {
    children: ReactNode;
    className?: string;
}

const AccordionContent = React.forwardRef<HTMLElement, AccordionContentProps>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Accordion.Content
            className='text-surface bg-[#f8fafd] data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
            {...props}
            //@ts-ignore
            ref={forwardedRef}
        >
            <div className="py-[15px] px-5">{children}</div>
        </Accordion.Content>
    );
});

AccordionContent.displayName = 'AccordionContent'

export default AccordionDemo;
