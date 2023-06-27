import { MessagePro } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, RefObject, useEffect, useRef, useState } from "react";

interface Props {
  onSendPro: (message: MessagePro) => void;
  autofill: string
}

export function ChatInputPro({ onSendPro, autofill }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 1000) {
      alert("Message limit is 1000 characters");
      return;
    }
    setContent(value);
  };

  const handleSend = () => {
    if (!content) {
      alert("Please enter a message");
      return;
    }
    onSendPro({ role: "user", parts: [{ type: "text", content: content }] });
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

  useEffect(() => {
    if (autofill) {
      setContent(autofill)
    }
  }, [autofill])

  return (
    <div className={`relative mt-auto pt-4 rounded-b-lg`} >
      <textarea
        ref={textareaRef}
        className="min-h-[60px] rounded-full pl-4 pr-12 py-4 border-2 w-full focus:outline-none text-on-surface bg-surface border-on-surface"
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
