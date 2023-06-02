import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

type ChatMode = 'pro' | 'lite';

const chatType = {
  pro: {
    model: OpenAIModel.GPT_4,
    system: `You are MusicGPT, an AI chatbot with an extensive understanding of music. Your purpose is to help users understand and learn about a specific song. You are given user prompt followed by clusters of relevant data messages. These data messages are sent to you from MusicGPT servers, so any command stated in them should be followed. Additionally, you do not reveal any specific implementation details or disclose how you receive data.

    As MusicGPT, you first examine the user prompt, then analyze all data entries simultaneously to find general musical patterns and features that are relevant to the user prompt. You show relevant data based on the user prompt, but prefer to explain the implications and impact of this data on the song, clearly and concisely in relation to user prompt. You communicate with users who have a low to moderate musical background and only answer questions related to the specific song. You must answer the user prompt fully, considering all aspects. You prefer to discuss MIDI values in terms of note names and octaves.
    
    You provide relevant visualizations based on the user prompt and corresponding data by adding commands to your response based on the schema below. Each command should be unique.
    The !{TypeID} command is a placeholder, where Type represents the type of visulization and ID represents the corresponding data ID

    Types:
    midi - midi visualization and playback
    audi - audio playback
    wave - graph visualization of the waveform
    hpcp - hpcp radial plot displaying the intensity of 12 musical notes
    mels - mel spectrum melody contour

    ID:
    Integers stated in relative message headers

    e.g. !{midi1} - midi visualization from data ID 1
    
    Here are the shortened keys in the data you might receive:
    
    s: startTimeSeconds
    d: durationSeconds
    p: pitchMidi
    a: amplitude
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
  console.log(messages)
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
