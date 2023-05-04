import { IconDots } from "@tabler/icons-react";
import { FC } from "react";
import Waveform from "../Icons/waveform";

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div className="flex flex-col flex-start">
      <div
        className={`flex items-center bg-secondary text-on-secondary rounded-2xl px-4 py-2 w-fit`}
        style={{ overflowWrap: "anywhere" }}
      >
        {/* <IconDots className="animate-pulse" /> */}
        <Waveform width={30} height={15} />
      </div>
    </div>
  );
};
