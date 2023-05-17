import { MessagePart, MessagePro } from "@/types";
import React from "react";
import { FC } from "react";
import dynamic from 'next/dynamic';
import AudioPlayer from "../MusicPlayer/AudioPlayer";

const PlayerElement = dynamic(() => import('../MusicPlayer/ReactPlayer'), { ssr: false });

// rest of your code


interface Props {
    message: MessagePro;
}

export const ChatMessagePro: FC<Props> = ({ message }: { message: MessagePro }) => {
    const renderMessagePart = (part: MessagePart) => {
        if (part.type === "text") {
            return part.content;
        } else if (part.type === "!{midi}") {
            return <PlayerElement
                buffer={part.content as Buffer}
                soundFont=""
                loop={true}
            />
        } else if (part.type === "!{audi}") {
            return <AudioPlayer
                file={part.content.file as File}
                startTime={part.content.start as number}
                finishTime={part.content.end as number}
            />
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
                className={`flex flex-col items-center ${message.role === "assistant"
                    ? "bg-on-surface text-surface"
                    : "bg-tertiary text-on-tertiary"
                    } rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
                style={{ overflowWrap: "anywhere" }}
            >
                {message.parts.map((part, index) => (
                    <React.Fragment key={index}>{renderMessagePart(part)}</React.Fragment>
                ))}
            </div>
        </div>
    );
};
