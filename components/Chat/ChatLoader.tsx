import { FC } from "react";
import Waveform from "../Icons/waveform";

interface ChatLoaderProps {
  messageType: boolean
}

export const ChatLoader: FC<ChatLoaderProps> = ({messageType}) => {
  return (
    <div className="flex flex-col flex-start">
      <div
        className={`flex items-center rounded-2xl px-4 py-2 w-fit ${messageType ? "bg-on-surface text-surface" : "bg-secondary text-on-secondary"}`}
        style={{ overflowWrap: "anywhere" }}
      >
        <Waveform width={30} height={15} color="darkgrey" />
      </div>
    </div>
  );
};
