import { MessagePro, OpenAIModel } from "@/types";
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';


export const config = {
    runtime: "edge"
};

interface request {
    content: string
}

type Completion = "good" | "pass";

interface Segment {
    start: number;
    end: number;
}

interface MusicGPTResponse {
    completion: Completion;
    analysis?: boolean;
    download?: boolean;
    segment?: Segment;
}

// Serialization functions
const setDefaultBoolean = (value: boolean | undefined): boolean => {
    return value ?? false;
}

const parseGPTResponse = (response: any): MusicGPTResponse | Error => {
    if (!response || typeof response !== "object") {
        return new Error("Invalid response object");
    }

    const { completion, analysis, download, segment } = response;
    console.log(completion)
    console.log(analysis)
    console.log(download)
    console.log(segment)

    if (!completion || (completion !== "good" && completion !== "pass")) {
        return new Error("Invalid or missing completion");
    }

    if (completion === "pass") {
        console.log(completion, completion, completion, completion, completion, completion, completion)
        return {completion};
    }

    if (!segment || typeof segment.start !== "number" || typeof segment.end !== "number") {
        return new Error("Invalid or missing segment");
    }

    console.log({
        completion,
        analysis: setDefaultBoolean(analysis),
        download: setDefaultBoolean(download),
        segment,
    })
    return {
        completion,
        analysis: setDefaultBoolean(analysis),
        download: setDefaultBoolean(download),
        segment,
    };
}

const processGPTResponse = (gptResponse: any): MusicGPTResponse | Error => {
    if (
        !gptResponse ||
        !gptResponse.choices ||
        !Array.isArray(gptResponse.choices) ||
        gptResponse.choices.length === 0 ||
        !gptResponse.choices[0].message ||
        !gptResponse.choices[0].message.content
    ) {
        return new Error("Invalid GPT response format");
    }
    console.log(gptResponse)
    const content = gptResponse.choices[0].message.content;
    let jsonResponse: any;

    try {
        jsonResponse = JSON.parse(content);
    } catch (error) {
        return new Error("Invalid JSON content in GPT response");
    }

    return parseGPTResponse(jsonResponse);
}

const handler = async (req: NextRequest): Promise<Response> => {

    if (req.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }
    try {
        // console.log(typeof(res))
        // console.log(res)
        // @ts-ignore
        const message = (await req.json() as request).content;
        console.log(message);


        const charLimit = 200;

        // if (message.content.length > charLimit) {
        //     //return error
        // }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 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`
            },
            method: "POST",
            body: JSON.stringify({
                model: OpenAIModel.DAVINCI_TURBO,
                messages: [
                    {
                        role: "system",
                        content: `-You are a helper-bot for MusicGPT, an AI assistant that helps users understand music
                        -Your task is to evaluate the user's prompt based on the instructions below and return a standardized JSON based on the stated schemas
                        -You only respond in the JSON format following the full schemas
                        -You are not allowed to respond in natural language`
                    },
                    {
                        role: "user",
                        content: `Instructions: Determine if the user prompt requires segmentation for a piece of music for any reason. If true, then determine if the user wants to download or perform analysis. If any of these actions are requested generate a JSON of schema {"completion": "good","analysis": boolean,"download": boolean,"segment": {"start": int,"end": int}}. If none of these actions are needed or you are unsure, return a JSON of schema {"completion": "pass"}. You return times in seconds. You ONLY respond in the JSON format following the full schemas. You are not allowed to respond in natural language.
                        User prompt: ${message}`
                    }
                ],
                max_tokens: 400,
                temperature: 0.0,
            })
        });
        const data = await response.json()
        const result = processGPTResponse(data);

        if (result instanceof Error) {
            console.error(result.message);
            return new Response("Error", { status: 500 });
        } else {
            console.log(result);
            console.log(NextResponse.json(
                result
            ))
            return NextResponse.json(
                result
            );
        }

    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};

export default handler;
