import { Message, MessagePro } from "@/types";
import { FC, RefObject } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { ResetChat } from "./ResetChat";
import { ChatMessagePro } from "./ChatMessagePro";
import { removeFileExtension } from "@/utils/utils";

interface Props {
  messages?: Message[];
  messagesPro?: MessagePro[];
  loading: boolean;
  onSend?: (message: Message) => void;
  onSendPro?: (message: MessagePro) => void;
  onReset: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  filename?: string
}


export const ChatBox: FC<Props> = ({ messages, messagesPro, loading, onSend, onSendPro, onReset, messagesEndRef, filename }) => {

  return (
    <>
      {/* <div className="flex flex-row justify-between items-center mb-4 sm:mb-8">
        <ResetChat onReset={onReset} />
      </div> */}

      <div className={`flex flex-initial flex-col ${messagesPro ? "calc-p-m sm:calc-p" : "sm:calc-l calc-l-m" }`}>

        {
          filename && <div className="text-3xl font-bold text-on-surface text-center p-2"> {removeFileExtension(filename)}</div>
        }
        <div className={`rounded-2xl flex-grow p-2 sm:p-4 overflow-y-auto relative overflow-hidden 
        ${messagesPro ? 'bg-on-surface' : 'bg-secondary'}`}>

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
              <ChatLoader messageType={messagesPro ? true : false} />
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {messagesPro ?
          <ChatInput onSendPro={onSendPro} />
          :
          <ChatInput onSend={onSend} />
        }

      </div>


    </>
  );
};
