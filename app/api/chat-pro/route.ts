import { ChatConf, Message } from "@/types";
import { OpenAIStream } from "./utils";
// import { auth } from '@clerk/nextjs';

export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        // const { userId, getToken } = auth();
        // if (!userId) {
        //     return new Response("Unauthorized", { status: 401 });
        // }

        const { messages, chatConf } = (await req.json()) as {
            messages: Message[];
            chatConf: ChatConf
        };

        const charLimit = 12000;
        let charCount = 0;
        let messagesToSend = [];

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.role === "data") {
                message.role = 'user'
            }
            if (charCount + message.content.length > charLimit) {
                break;
            }
            charCount += message.content.length;
            messagesToSend.push(message);
        }

        const stream = await OpenAIStream(messagesToSend, chatConf);

        return new Response(stream);

    } catch (error) {
        return new Response("Error", { status: 500 });
    }
};