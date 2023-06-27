import { MessagePro } from "@/types";
import { RefObject, useState } from "react";
import { ChatInputPro } from "./ChatInputPro";
import { ChatLoader } from "./ChatLoader";
import { ChatMessagePro } from "./ChatMessagePro";
import { removeFileExtension } from "@/utils/utils";
import { ChatMessage } from "@/components/Chat/ChatMessage";
import { EmptyScreen } from "@/components/empty-screen";
import { ChatFooter } from "@/components/Chat/ChatFooter";

interface ChatBoxProProps {
    messagesPro: MessagePro[];
    loading: boolean;
    onSendPro: (message: MessagePro) => void;
    messagesEndRef: RefObject<HTMLDivElement>;
    filename: string
}


export default function ChatBoxPro({ messagesPro, loading, onSendPro, messagesEndRef, filename }: ChatBoxProProps) {
    const [autofill, setAutofill] = useState('')
    return (
        <>
            <div className="flex flex-initial flex-col calc-p-m sm:calc-p">
                <div className="text-3xl font-bold text-on-surface text-center p-2"> {removeFileExtension(filename)}</div>
                <div className="rounded-2xl flex-grow p-2 sm:p-4 overflow-y-auto relative overflow-hidden bg-on-surface">
                    {
                        messagesPro.length > 1 ? messagesPro.map((message, index) => (
                            <div
                                key={index}
                                className="my-1 sm:my-1.5"
                            >
                                <ChatMessagePro message={message} />
                            </div>
                        )) :
                            <ChatMessage role="assistant" chat="pro" >
                                <EmptyScreen
                                    setInput={(e) => { setAutofill(e) }}
                                    introMessage={`Hello! I'm MusicGPT Pro, your AI music assistant. I am currently in Beta, so I might produce inacurate information. Let's talk about ${removeFileExtension(filename)}.`}
                                    exampleMessages={[
                                        {
                                            heading: 'Explain the harmonies',
                                            message: `In the first 10 seconds, how do harmonies play a role in shaping the mood and enhancing the overall sonic texture of the composition?`
                                        },
                                        {
                                            heading: 'Create a custom visualization',
                                            message: 'Create a custom visualization to show the intensity of the notes in the first 5 seconds.'
                                        },
                                        {
                                            heading: 'Playback',
                                            message: `Playback the music and midi for the first 5 seconds.`
                                        }
                                    ]} variant={'pro'} />
                            </ChatMessage>
                    }

                    {loading && (
                        <div className="my-1 sm:my-1.5">
                            <ChatLoader variant={'pro'} />
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
                <ChatInputPro onSendPro={onSendPro} autofill={autofill} />
                <ChatFooter className="block" />
            </div>
        </>
    );
};