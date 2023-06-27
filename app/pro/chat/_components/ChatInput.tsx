import { Message, MessagePro } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface Props {
  onSend?: (message: Message) => void;
  onSendPro?: (message: MessagePro) => void;
}

export const ChatInput: FC<Props> = ({ onSend, onSendPro }) => {
  const [content, setContent] = useState<string>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (!content) {
      alert("Please enter a message");
      return;
    }
    if (onSend) {
      onSend({ role: "user", content });
    } else if (onSendPro) {
      onSendPro({ role: "user", parts: [{ type: "text", content: content }] });
    }
    setContent("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative mt-auto pt-4 rounded-b-lg`} >
      <textarea
        ref={textareaRef}
        className={`min-h-[60px] rounded-full pl-4 pr-12 py-4 border-2 w-full focus:outline-none text-on-surface bg-surface 
        ${onSendPro ? 'border-on-surface' : 'bg-secondary text-on-secondary'}`}
        style={{ resize: "none" }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => handleSend()}>
        <IconArrowUp className="absolute right-4 bottom-5 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-secondary text-on-secondary hover:opacity-80" />
      </button>
    </div >
  );
};
