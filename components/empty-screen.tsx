import { Button } from '@/components/button'
import { IconArrowRight } from '@/components/icons'

const exampleMessages = [
    {
        heading: 'Explain the lyrics',
        message: `What is the meaning behind the lyrics?`
    },
    {
        heading: 'Summarize the song',
        message: 'How do the musical features work in tandem with the lyrics to enchance the overvall experience?'
    },
    {
        heading: 'Discover the Artist',
        message: `Tell me about the history of Artist and the album`
    }
]

interface EmptyScreenProps {
    setInput: (input: string) => void;
    fullTitle: string | undefined
}

export function EmptyScreen({ setInput, fullTitle }: EmptyScreenProps) {
    return (
        <div className="flex-col overflow-hidden flex-1 text-on-secondary-container">
            {/* <h1 className="mb-2 text-lg font-semibold">
                    Welcome to Next.js AI Chatbot!
                </h1> */}
            <p className="mb-2 leading-normal">
                Hello! I'm MusicGPT, your AI music assistant. I can help you explore the musical structure, lyrics, and cultural relevance of songs. Let's talk about {fullTitle}. What would you like to know?
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
