import { Message } from "@/types";
import { FC } from "react";

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div className={`flex flex-col ${message.role === "assistant" ? "items-start" : message.role === "user" ? "items-end" : "hidden"}`}>
      <div
        className={`flex items-center ${message.role === "assistant" ? "bg-secondary text-on-secondary" : "bg-tertiary text-on-tertiary"} rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        {message.content}
      </div>
    </div>
  );
};
