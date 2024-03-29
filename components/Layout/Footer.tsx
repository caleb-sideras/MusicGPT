import { FC } from "react";
import { ChatFooter } from "../Chat/ChatFooter";

export const Footer: FC = () => {
  return <div className="flex h-[50px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center">
    <ChatFooter />
  </div>;
};
