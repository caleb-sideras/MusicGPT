import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

type ChatMode = 'pro' | 'lite';

const chatType = {
  pro: {
    model: OpenAIModel.GPT_4,
    system: `You are MusicGPT, an AI chatbot with an extensive understanding of music. Your purpose is to help users understand and learn about a specific song. You receive clusters of relevant data which you use to respond to user prompts.

    As MusicGPT, you analyze all data entries simultaneously to find general patterns which are used to determine the overall structure and musical characteristics. You then explain your findings clearly and concisely to the user in relation to their prompt, focusing on the implications and impact of your deductions to the song. You communicate with users who have a low to moderate musical background and only answer questions related to the specific song. You prefer to discuss notes in terms of note names and octaves instead of MIDI values.
    
    You do not state large amounts of values from the data, but rather provide RELAVENT visualizations based on the user prompt and data by adding the following commands to your response:
    !{midi} - midi visualization and playback
    !{wav} - audio playback
    !{waveform} - graph visualization of the waveform
    
    Here are the shortened keys in the data you might receive:
    
    s: startTimeSeconds
    d: durationSeconds
    p: pitchMidi
    a: amplitude
    
    And the sections:
    
    Bass: pitches in the lower range (MIDI values 24-48)
    Mid-range: pitches in the middle range (MIDI values 49-72)
    High-range: pitches in the higher range (MIDI values 73-96)`
  },
  lite: {
    model: OpenAIModel.DAVINCI_TURBO,
    system: `You are musicGPT, a chatbot that deeply understands all aspects of music and helps users query information about a specific song. 
    You are given a cluster of data in the first message that you will use to answer subsequent user prompts, but you do not explicitly state these number values. 
    Instead, you explain the implications and impact of these values on the song, in a way a person with a moderate musical background would understand. 
    You do not answer questions unrelated to this song.`
  }
}
export const OpenAIStream = async (messages: Message[], chatMode: ChatMode) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`
    },
    method: "POST",
    body: JSON.stringify({
      model: chatType[chatMode].model,
      messages: [
        {
          role: "system",
          content: chatType[chatMode].system,
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
