import { useUser } from '@clerk/clerk-react';
import Waveform from "@/components/Icons/waveform";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


export interface ChatLiteProps {
  role: VariantProps<typeof innerDivVariants>["role"];
  chat: VariantProps<typeof innerDivVariants>["chat"];
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

export const innerDivVariants = cva(
  'flex flex-row overflow-hidden flex-1 rounded-2xl p-3 whitespace-pre-wrap',
  {
    variants: {
      chat: {
        lite: '',
        pro: '',
        home: '',
      },
      role: {
        assistant: 'bg-secondary-container text-on-secondary-container',
        user: 'bg-secondary text-on-secondary',
        data: '',
      }
    },
    compoundVariants: [
      {
        chat: "pro",
        role: "assistant",
        className: "bg-surface text-on-surface",
      },
      {
        chat: "pro",
        role: "user",
        className: "bg-on-surface text-surface",
      },
      {
        chat: "home",
        role: "assistant",
        className: "bg-tertiary-container text-on-tertiary-container",
      },
      {
        chat: "home",
        role: "user",
        className: "bg-transparent text-on-tertiary",
      }
    ],
    defaultVariants: {
      chat: 'lite',
      role: 'data'
    },
  }
)

const defaultIconVariants = cva(
  'w-9 h-9 flex justify-center rounded-full',
  {
    variants: {
      chat: {
        lite: 'bg-[#334b4f]',
        pro: 'bg-[#191c1d]',
        home: 'bg-[#3a4664]',
      },
    },
  }
)

export function ChatMessage({ role, chat, children }: ChatLiteProps) {
  const { user } = useUser();

  return (
    <div
      className={cn(outerDivVariants({ role: role }))}
    >
      <div
        className={cn(innerDivVariants({ chat: chat, role: role }))}
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
                    <div className={cn(defaultIconVariants({ chat: chat }))}></div>
                }
              </div>
          }
        </div>
        {children}
      </div>
    </div >
  );
};
