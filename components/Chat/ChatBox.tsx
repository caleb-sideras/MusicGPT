import { Message } from "@/types";
import { FC, RefObject } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
  onReset: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}


export const ChatBox: FC<Props> = ({ messages, loading, onSend, onReset, messagesEndRef }) => {

  return (
    <>
      {/* <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div> */}

      <div className="flex flex-col rounded-lg px-2 sm:p-4 sm:border rounded-b-none border-outline max-h-full overflow-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className="my-1 sm:my-1.5"
          >
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="bottom-[56px] left-0 w-full">
        <ChatInput onSend={onSend} />
      </div>
    </>
  );
};
