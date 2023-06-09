import { Message, MessagePro } from "@/types";
import { FC, RefObject } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";
import { ChatMessagePro } from "./ChatMessagePro";

interface Props {
  messages?: Message[];
  messagesPro?: MessagePro[];
  loading: boolean;
  onSend?: (message: Message) => void;
  onSendPro?: (message: MessagePro) => void;
  onReset: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}


export const ChatBox: FC<Props> = ({ messages, messagesPro, loading, onSend, onSendPro, onReset, messagesEndRef }) => {

  return (
    <>
      {/* <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div> */}

      <div className="flex flex-col bg-surface rounded-lg px-2 sm:p-4 sm:border rounded-b-none border-outline max-h-full overflow-auto">
        {
          messages ? messages.map((message, index) => (
            <div
              key={index}
              className="my-1 sm:my-1.5"
            >
              <ChatMessage message={message} />
            </div>
          )) :
          messagesPro ? messagesPro.map((message, index) => (
            <div
              key={index}
              className="my-1 sm:my-1.5"
            >
              <ChatMessagePro message={message} />
            </div>
          )) :
          <></>
        }

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader messageType={messagesPro ? true: false} />
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="bottom-[56px] left-0 w-full">
        <ChatInput onSendPro={onSendPro} onSend={onSend} />
      </div>
    </>
  );
};
