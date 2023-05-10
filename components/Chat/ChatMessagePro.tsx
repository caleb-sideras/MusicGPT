import { MessagePart, MessagePro } from "@/types";
import React from "react";
import { FC } from "react";
import PlayerElement from "../MusicPlayer/ReactPlayer";

interface Props {
    message: MessagePro;
}

export const ChatMessagePro: FC<Props> = ({ message }: { message: MessagePro }) => {
    const renderMessagePart = (part: MessagePart) => {
        if (part.type === "text") {
            return part.content;
        } else if (part.type === "!{midi}") {
            console.log("midi visualization")
            // return <PlayerElement
            //     buffer={fileData}
            //     soundFont=""
            //     loop={true}
            // />
        } else if (part.type === "!{audio}") {
            console.log("audio visualization")
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
                className={`flex items-center ${message.role === "assistant"
                    ? "bg-secondary text-on-secondary"
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
