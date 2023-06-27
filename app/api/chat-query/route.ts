import { OpenAIModel } from "@/types";
import { NextRequest, NextResponse } from 'next/server';
import { processGPTResponse } from "./utils";

export const runtime = 'edge'

interface request {
    content: string
}

const yamlPro = `musicgpt: 1.0.1; info: title: MusicGPT Helper, description: As a MusicGPT helper, fill relevant fields based on user prompts. Respond ONLY in JSON per the schema; schema: type: object, required: [notes, download, segments, spectralFeatures, prodFeatures], properties: completion: type: boolean, description: Are any fields filled?, required: true, notes: type: boolean, description: We need MIDI notes for all musical/song explanations, required: true, download: type: boolean, description: Need a downloadable audio file?, required: true, segments: type: list, description: List of requested music sections with start/end times, required: true, properties: type: object, properties: start: type: integer, description: Segment start time in seconds, end: type: integer, description: Segment end time in seconds, spectralFeatures: type: boolean, description: Need to analyze frequency/spectral features such as centroid, spread, skewness, Constant-Q Transformation, kurtosis etc for in-depth understanding of the song's characteristics?, required: true, prodFeatures: type: boolean, description: Need details about production features such as Compression and Stereo Image - inlcuding Dynamic Complexity, Loudness, Panning Score Coefficient and more?, required: true; User prompt:`

export async function POST(req: Request) {
    try {
        const message = (await req.json() as request).content;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            method: "POST",
            body: JSON.stringify({
                model: OpenAIModel.GPT_4,
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
        const result = processGPTResponse(data);
        if (result instanceof Error) {
            console.error(result.message);
            return new Response("Error", { status: 500 });
        } else {
            return NextResponse.json(
                result
            );
        }

    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
};