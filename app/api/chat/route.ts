import { ChatConf } from "@/types";
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { Message as M } from 'ai/react'
import { Configuration, OpenAIApi } from 'openai-edge'
// import { auth } from '@clerk/nextjs';

export const runtime = 'edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
    try {
        // const { userId, getToken } = auth();
        // if (!userId) {
        //     return new Response("Unauthorized", { status: 401 });
        // }

        const json = await req.json()
        const { messages, chatConf } = json as {
            messages: M[];
            chatConf: ChatConf
        };

        const charLimit = 12000;
        let charCount = 0;
        let formattedMessages: Message[] = [
            {
                role: "system",
                content: `You are musicGPT, a chatbot that deeply understands all aspects of music and helps users query information about a specific song. 
                You are given a cluster of data in the first message that you will use to answer subsequent user prompts, but you do not explicitly state these number values. 
                Instead, you explain the implications and impact of these values on the song, in a way a person with a moderate musical background would understand. 
                You do not answer questions unrelated to this song.`
            } as Message
        ];

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.role === "data") {
                message.role = 'user'
            }
            if (charCount + message.content.length > charLimit) {
                break;
            }
            charCount += message.content.length;
            formattedMessages.push(message as Message);
        }

        const res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: formattedMessages,
            temperature: 0.0,
            stream: true
        })

        const stream = OpenAIStream(res, {
            // async onCompletion(completion) {
            //     const title = json.messages[0].content.substring(0, 100)
            // }
        })

        return new StreamingTextResponse(stream)
    } catch (error) {
        return new Response("Error", { status: 500 });
    }

}