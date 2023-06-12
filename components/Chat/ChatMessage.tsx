import { Message } from "@/types";
import { FC } from "react";
import { useUser } from '@clerk/clerk-react';
import Waveform from "../Icons/waveform";
import Image from "next/image";


interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const { user } = useUser();

  return (
    <div
      className={`block w-full ${message.role === "assistant"
        ? "items-start justify-start"
        : message.role === "user"
          ? "items-start"
          : "hidden"
        }`}
    >
      <div
        className={`flex flex-row overflow-hidden flex-1 ${message.role === "assistant"
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-secondary text-on-secondary"
          } rounded-2xl p-3 whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        <div className="items-start mr-4">
          {
            message.role === "assistant" ?
              <Waveform width={54} height={14.4} animation={false} color="#93a8ac" />
              :
              <div className=" w-14 justify-center flex">
                {
                  user?.imageUrl
                    ?
                    <Image width={35} height={35} src={user?.imageUrl as string} alt="UI" className="rounded-full" />
                    :
                    <div className="bg-[#cd9c54] w-9 h-9 flex justify-center rounded-full"></div>
                }
              </div>
          }
        </div>
        <div className="gap-4 pt-1 flex flex-col overflow-x-auto">
          {message.content}
        </div>
      </div>
    </div>
  );
};
