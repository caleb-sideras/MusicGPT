import { FC } from "react";
import Waveform from "../Icons/waveform";

interface ChatLoaderProps {
  messageType: boolean
}

export const ChatLoader: FC<ChatLoaderProps> = ({messageType}) => {
  return (
    <div className="flex flex-col flex-start w-full">
      <div
        className={`flex items-center rounded-2xl p-3 ${messageType ? "bg-surface text-on-surface" : "bg-secondary-container text-on-secondary-container"}`}
        style={{ overflowWrap: "anywhere" }}
      >
        <Waveform width={54} height={14.4} color={`${ messageType ? '#93a8ac' : '#93a8ac'}`} />
      </div>
    </div>
  );
};
