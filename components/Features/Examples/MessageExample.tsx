import { ChatMessagePro } from "@/app/pro/chat/_components/ChatMessagePro";
import { ChatMessage } from "@/components/Chat/ChatMessage";


export default function MessageExample() {
    return (
        <div className="rounded-xl bg-tertiary p-2">
            <ChatMessage role={"user"} chat={"home"}>
                From 20-40 seconds, how do harmonies play a role in shaping the mood?
            </ChatMessage>
            <ChatMessage role={"assistant"} chat={"home"}>
                During this specific segment, the harmony evolves through a chord progression from C to G to Am to F. This change, popular in many songs, moves from major to minor tones, influencing the emotional mood of the piece. The shift to the F chord can provide a sense of resolution or comfort. These harmonic changes, paired with corresponding melodic variations, create a dynamic, nuanced sonic landscape.
            </ChatMessage>
        </div>
    )

}