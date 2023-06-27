import { Button } from '@/components/button'
import { IconArrowRight } from '@/components/icons'
import { cva, VariantProps } from 'class-variance-authority';


interface EmptyScreenProps {
    setInput: (input: string) => void;
    introMessage: string;
    exampleMessages: {
        heading: string;
        message: string;
    }[];
    variant: VariantProps<typeof outerDiv>["variant"];
}

const outerDiv = cva(
    'flex-col overflow-hidden flex-1',
    {
        variants: {
            variant: {
                pro: 'text-on-surface',
                lite: 'text-on-secondary-container',
            }
        },
        defaultVariants: {
            variant: 'pro'
        }
    }
)

export function EmptyScreen({ setInput, introMessage, exampleMessages, variant }: EmptyScreenProps) {
    return (
        <div className={outerDiv({ variant: variant })}>
            <p className="mb-2 leading-normal">
                {introMessage}
            </p>
            <p className="leading-normal">
                Not sure where to start? You can try:
            </p>
            <div className="mt-4 flex flex-col items-start space-y-2">
                {exampleMessages.map((message, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="lg"
                        className="h-auto p-0 text-base"
                        onClick={() => setInput(message.message)}
                    >
                        <IconArrowRight className="mr-2 text-grey" />
                        {message.heading}
                    </Button>
                ))}
            </div>
        </div>
    )
}
