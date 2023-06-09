import { ChatConf, Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
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
    console.log(messagesToSend)

    const stream = await OpenAIStream(messagesToSend, chatConf);

    return new Response(stream);
    
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
