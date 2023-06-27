import { MessagePro } from "@/types";
import { RefObject } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessagePro } from "./ChatMessagePro";
import { removeFileExtension } from "@/utils/utils";

interface ChatBoxProProps {
    messagesPro: MessagePro[];
    loading: boolean;
    onSendPro: (message: MessagePro) => void;
    messagesEndRef: RefObject<HTMLDivElement>;
    filename: string
}


export default function ChatBoxPro({ messagesPro, loading, onSendPro, messagesEndRef, filename }: ChatBoxProProps) {
    return (
        <>
            <div className="flex flex-initial flex-col calc-p-m sm:calc-p">
                <div className="text-3xl font-bold text-on-surface text-center p-2"> {removeFileExtension(filename)}</div>
                <div className="rounded-2xl flex-grow p-2 sm:p-4 overflow-y-auto relative overflow-hidden bg-on-surface">
                    {
                        messagesPro.map((message, index) => (
                            <div
                                key={index}
                                className="my-1 sm:my-1.5"
                            >
                                <ChatMessagePro message={message} />
                            </div>
                        ))
                    }

                    {loading && (
                        <div className="my-1 sm:my-1.5">
                            <ChatLoader variant={'pro'} />
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
                <ChatInput onSendPro={onSendPro} />
            </div>
        </>
    );
};