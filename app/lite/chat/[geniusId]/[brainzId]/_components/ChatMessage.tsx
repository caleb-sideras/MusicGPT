import { FC } from "react";
import { useUser } from '@clerk/clerk-react';
import Waveform from "@/components/Icons/waveform";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


export interface ChatLiteProps {
  role: VariantProps<typeof outerDivVariants>["role"];
  children: React.ReactNode;
}

const outerDivVariants = cva(
  'block w-full items-start',
  {
    variants: {
      role: {
        data: 'hidden',
        assistant: 'justify-start',
        user: 'justify-end',
      }
    },
    defaultVariants: {
      role: 'data'
    }
  }
)

const innerDivVariants = cva(
  'flex flex-row overflow-hidden flex-1 rounded-2xl p-3 whitespace-pre-wrap',
  {
    variants: {
      role: {
        assistant: 'bg-secondary-container text-on-secondary-container',
        user: 'bg-secondary text-on-secondary',
        data: ''
      },
    },
    defaultVariants: {
      role: 'data',
    },
  }
)

export const ChatMessage: FC<ChatLiteProps> = ({ role, children }: ChatLiteProps) => {
  const { user } = useUser();

  return (
    <div
      className={cn(outerDivVariants({ role: role }))}
    >
      <div
        className={cn(innerDivVariants({ role: role }))}
        style={{ overflowWrap: "anywhere" }}
      >
        <div className="items-start mr-4">
          {
            role === "assistant" ?
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
        {children}
      </div>
    </div>
  );
};
