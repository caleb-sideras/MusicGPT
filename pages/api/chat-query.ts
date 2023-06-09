import { MessagePro, OpenAIModel } from "@/types";
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';


export const config = {
    runtime: "edge"
};

interface request {
    content: string
}

interface Segment {
    start: number;
    end: number;
}

interface MusicGPTResponse {
    completion: boolean;
    notes?: boolean;
    download?: boolean;
    spectralFeatures?: boolean;
    prodFeatures?: boolean;
    segments?: Segment[];
}

// Serialization functions
const setDefaultBoolean = (value: boolean | undefined): boolean => {
    return value ?? false;
}

const parseGPTResponse = (response: any): MusicGPTResponse | Error => {
    if (!response || typeof response !== "object") {
        return new Error("Invalid response object");
    }

    let { completion, notes, download, segments, spectralFeatures, prodFeatures } = response;

    if (typeof completion !== "boolean") {
        return new Error("Invalid or missing completion");
    }

    if (!Array.isArray(segments) || segments.some(segment => typeof segment.start !== "number" || typeof segment.end !== "number")) {
        // return new Error("Invalid or missing segments");
        segments = []
    }

    return {
        completion,
        notes: setDefaultBoolean(notes),
        download: setDefaultBoolean(download),
        spectralFeatures: setDefaultBoolean(spectralFeatures),
        prodFeatures: setDefaultBoolean(prodFeatures),
        segments,
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

    const content = gptResponse.choices[0].message.content;
    let jsonResponse: any;

    try {
        jsonResponse = JSON.parse(content);
    } catch (error) {
        return new Error("Invalid JSON content in GPT response");
    }
    console.log(jsonResponse)
    return parseGPTResponse(jsonResponse);
}

const yamlPro = `musicgpt: 1.0.1; info: title: MusicGPT Helper, description: As a MusicGPT helper, fill relevant fields based on user prompts. Respond ONLY in JSON per the schema; schema: type: object, required: [notes, download, segments, spectralFeatures, prodFeatures], properties: completion: type: boolean, description: Are fields filled?, required: true, notes: type: boolean, description: We need MIDI notes for all musical/song explanations, required: true, download: type: boolean, description: Need a downloadable audio file?, required: true, segments: type: list, description: List of requested music sections with start/end times, required: true, properties: type: object, properties: start: type: integer, description: Segment start time in seconds, end: type: integer, description: Segment end time in seconds, spectralFeatures: type: boolean, description: Need to analyze frequency/spectral features such as centroid, spread, skewness, Constant-Q Transformation, kurtosis etc for in-depth understanding of the song's characteristics?, required: true, prodFeatures: type: boolean, description: Need details about production features such as Compression and Stereo Image - inlcuding Dynamic Complexity, Loudness, Panning Score Coefficient and more?, required: true; User prompt:`

const handler = async (req: NextRequest): Promise<Response> => {

    if (req.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }
    try {
        // @ts-ignore
        const message = (await req.json() as request).content;
        console.log(message);

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
                        -You only respond in the JSON format following the full schema
                        -You are not allowed to respond in natural language`
                    },
                    {
                        role: "user",
                        content: `${yamlPro} ${message}`
                    }
                ],
                max_tokens: 400,
                temperature: 0.0,
            })
        });
        const data = await response.json()
        console.log(data)
        const result = processGPTResponse(data);
        console.log(result)
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
