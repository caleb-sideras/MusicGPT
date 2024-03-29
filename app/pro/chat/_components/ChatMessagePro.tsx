"use client";

import dynamic from "next/dynamic";
import React, { FC } from "react";

import { MessagePart, MessagePro } from "@/types";
import LoadingWaveform from "@/components/Loaders/FillLoader";

const AudioPlayer = dynamic(() => import('@/components/MusicPlayer/AudioPlayer'), {
    ssr: false,
    loading: () =>
        <LoadingWaveform />
});
const HPCPPlot = dynamic(() => import('@/components/Visualizations/Radial'), {
    ssr: false,
    loading: () =>
        <LoadingWaveform />
});
const CodeFormatter = dynamic(() => import('./CodeFormatter'), {
    ssr: false,
    loading: () =>
        <LoadingWaveform />
});
const CodeExec = dynamic(() => import('@/components/Visualizations/CodeExec'), {
    ssr: false,
    loading: () =>
        <LoadingWaveform />
});
const MidiPlayer = dynamic(() => import('@/components/MusicPlayer/MidiPlayer'), {
    ssr: false,
    loading: () =>
        <LoadingWaveform />
});
import { PlotMelodyContourComponent } from "@/components/Visualizations/Essentia";


import Waveform from "@/components/Icons/waveform";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface Props {
    message: MessagePro;
}

export const ChatMessagePro: FC<Props> = ({ message }: { message: MessagePro }) => {
    const { user } = useUser();
    const renderMessagePart = (part: MessagePart) => {
        if (part.type === "text") {
            return part.content;
        } else if (part.type === "midi") {
            return <MidiPlayer
                data={part.content}
                soundFont=""
                loop={true}
            />
        } else if (part.type === "audi") {
            return <AudioPlayer
                file={part.content.file as File}
                startTime={part.content.start as number}
                finishTime={part.content.end as number}
            />
        } else if (part.type === "hpcp") {
            return <HPCPPlot hpcpValues={part.content as Float32Array} />
        } else if (part.type === "mels") {
            return <PlotMelodyContourComponent
                featureArray={part.content}
                audioFrameSize={960000}
                audioSampleRate={44100}
                plotTitle="Harmonic Pitch Class Profile mel"
            />
        } else if (part.type === "code") {
            return (
                <CodeFormatter text={part.content} language={"javascript"} />
            );
        } else if (part.type === "exec") {
            return <CodeExec parameters={part.content.parameters} code={part.content.code} />
        }
        return null;
    };

    return (
        <div
            className={`block w-full ${message.role === "assistant"
                ? "items-start justify-start"
                : message.role === "user"
                    ? "items-start"
                    : "hidden"
                }`}
        >
            <div
                className={`flex flex-row overflow-hidden flex-1 ${message.role === "assistant"
                    ? "bg-surface text-on-surface"
                    : "bg-on-surface text-surface"
                    } rounded-2xl p-3 whitespace-pre-wrap`}
                style={{ overflowWrap: "anywhere" }}
            >
                <div className="items-start mr-4">
                    {
                        message.role === "assistant" ?
                            <Waveform width={54} height={14.4} animation={false} color="#93a8ac" />
                            :
                            <div className=" w-14 justify-center flex">
                                {
                                    user?.imageUrl
                                        ?
                                        <Image width={35} height={35} src={user?.imageUrl as string} alt="UI" className="rounded-full" />
                                        :
                                        <div className="bg-[#cd9c54] w-9 h-9 flex justify-center rounded-full"></div>
                                }
                            </div>
                    }
                </div>
                <div className="gap-4 pt-1 flex flex-col overflow-x-hidden">
                    {message.parts.map((part, index) => (
                        <React.Fragment key={index}>{renderMessagePart(part)}</React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
