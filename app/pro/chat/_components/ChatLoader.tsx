import Waveform from "@/components/Icons/waveform";
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils";


interface ChatLoaderProps {
  variant: VariantProps<typeof outerDivVariants>["variant"];
}

const outerDivVariants = cva(
  'flex items-center rounded-2xl p-3 ',
  {
    variants: {
      variant: {
        pro: 'bg-surface text-on-surface',
        lite: 'bg-secondary-container text-on-secondary-container',
      }
    },
    defaultVariants: {
      variant: 'pro'
    }
  }
)

export function ChatLoader({ variant }: ChatLoaderProps) {
  return (
    <div className="flex flex-col flex-start w-full">
      <div
        className={cn(outerDivVariants({ variant: variant }))}
        style={{ overflowWrap: "anywhere" }}
      >
        <Waveform width={54} height={14.4} color={'#93a8ac'} />
      </div>
    </div>
  );
};
