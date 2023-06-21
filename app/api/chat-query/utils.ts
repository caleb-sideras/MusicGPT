export interface MusicGPTResponse {
    completion: boolean;
    notes?: boolean;
    download?: boolean;
    spectralFeatures?: boolean;
    prodFeatures?: boolean;
    segments?: Segment[];
}

export interface Segment {
    start: number;
    end: number;
}

export const setDefaultBoolean = (value: boolean | undefined): boolean => {
    return value ?? false;
}

export const parseGPTResponse = (response: any): MusicGPTResponse | Error => {
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

export const processGPTResponse = (gptResponse: any): MusicGPTResponse | Error => {
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
    return parseGPTResponse(jsonResponse);
}