import { MessagePart, MessagePro } from "@/types";
import React from "react";
import { FC } from "react";
import dynamic from 'next/dynamic';
import AudioPlayer from "../MusicPlayer/AudioPlayer";
import HPCPPlot from "../Visualizations/Radial";
import { PlotMelodyContourComponent } from "../Visualizations/Essentia";
import CodeFormatter from "./CodeFormatter";
import CodeExec from "../Visualizations/CodeExec";
const PlayerElement = dynamic(() => import('../MusicPlayer/ReactPlayer'), { ssr: false });

interface Props {
    message: MessagePro;
}

export const ChatMessagePro: FC<Props> = ({ message }: { message: MessagePro }) => {
    const renderMessagePart = (part: MessagePart) => {
        if (part.type === "text") {
            return part.content;
        } else if (part.type === "midi") {
            return <PlayerElement
                buffer={part.content as Buffer}
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
            className={`flex flex-col ${message.role === "assistant"
                ? "items-start"
                : message.role === "user"
                    ? "items-end"
                    : "hidden"
                }`}
        >
            <div
                className={`flex flex-col items-center gap-4 ${message.role === "assistant"
                    ? "bg-on-surface text-surface"
                    : "bg-tertiary text-on-tertiary"
                    } rounded-2xl px-3 py-2 sm:max-w-[67%] max-w-[90%] whitespace-pre-wrap`}
                style={{ overflowWrap: "anywhere" }}
            >
                {message.parts.map((part, index) => (
                    <React.Fragment key={index}>{renderMessagePart(part)}</React.Fragment>
                ))}
            </div>
        </div>
    );
};
