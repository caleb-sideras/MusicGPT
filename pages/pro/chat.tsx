import {
  useEffect,
  useState,
  useRef,
  SetStateAction,
  Dispatch
} from "react";
import {
  NoteEventTime,
  generateFileData,
} from "@/utils/basic-pitch-ts/src";
import {
  Message,
  MessagePart,
  MessagePro,
  MessageProData,
  FileProps,
  ProState,
  ProdProps,
  GraphProps,
  ChatData,
  ParserState
} from "@/types";
import { ChatBox } from "@/components/Chat/ChatBox";
import CommandParser from "@/utils/commandParser";
import Upload from "@/components/AudioUpload/Upload";
import AudioSelection from "@/components/AudioUpload/AudioSelection";
import Waveform from "@/components/Icons/waveform";
import * as Form from '@radix-ui/react-form';
import Instructions from "@/components/AudioUpload/Instructions";
import EssentiaExtractor from "@/utils/essentia/extractor/extractor";
import EssentiaWASM from '@/utils/essentia/dist/essentia-wasm.web'
import Essentia from "@/utils/essentia/core_api";
import { convertMessageProToMessage, filterAndAdjustNotesByTime, formatCategorizeStringifyNotesForModel, removeFileExtension } from "@/utils/utils";
import ApiKey from "@/components/AudioUpload/ApiKey";
import { Role } from "@/types";

export interface VisualizerConfig {
  noteHeight?: number;
  noteSpacing?: number;
  pixelsPerTimeStep?: number;
  noteRGB?: string;
  activeNoteRGB?: string;
  minPitch?: number;
  maxPitch?: number;
}

const ProChat: React.FC = () => {

  const [currentState, setCurrentState] = useState<ProState>(ProState.menu)
  const [apiKey, setAPIKey] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessagePro[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFirstMessage, setIsFirstMessage] = useState<Boolean>(true)

  const [chatData, setChatData] = useState<ChatData>()

  useEffect(() => {
    if (currentState === ProState.instructions) {
      setMessages([
        handleInitialData(),
        {
          role: "assistant",
          parts: [{ type: 'text', content: `Hello! I'm MusicGPT Pro, your AI music assistant. I am currently in Beta, so I might produce inacurate information. Let's talk about ${removeFileExtension(chatData?.file?.name as string)}. What would you like to know?` }]
        }
      ]);
    }
  }, [currentState, chatData])

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (updatedMessages: MessagePro[], dataForVisualizations: Record<string, any>, parse: boolean) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: convertMessageProToMessage(updatedMessages),
        chatConf: {
          chatMode: "pro",
          apiKey: apiKey ? apiKey : ""
        },
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    const essentiaInstance = await Essentia.init(EssentiaWASM, true);
    const essentiaExtractor = new EssentiaExtractor(essentiaInstance, true);
    const commandParser = new CommandParser(chatData as ChatData, essentiaExtractor, dataForVisualizations)
    let parts: MessagePart[] | null = null;
    let parserState: ParserState;
    let currentMessage: MessagePart[] = []

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      let parsed = commandParser.receiveAndProcessText(chunkValue)

      if (parsed) {
        [parts, parserState] = parsed
        switch (parserState) {

          case ParserState.COMMAND:

            currentMessage.push(...parts as MessagePart[]);

            if (isFirst) {
              isFirst = false;
              setMessages((messages) => {
                return [
                  ...messages,
                  {
                    role: "assistant",
                    parts: parts as MessagePart[],
                  }]
              });
            } else {
              setMessages((messages) => {
                const updatedMessage = {
                  role: "assistant" as Role,
                  parts: currentMessage,
                };
                return [...messages.slice(0, -1), updatedMessage];
              });
            }
            break;

          case ParserState.CODE_END:
            currentMessage.pop()
            currentMessage.push(...parts as MessagePart[]);
            setMessages((messages) => {
              const updatedMessage = {
                role: "assistant" as Role,
                parts: currentMessage,
              };
              return [...messages.slice(0, -1), updatedMessage];
            });
            break;

          default:
            break;
        }

      }
    }

    if (commandParser.getBuffer()) {
      setMessages((messages) => {
        const updatedMessage = {
          role: "assistant" as Role,
          parts: [...currentMessage, ...commandParser.getBuffer()],
        };
        return [...messages.slice(0, -1), updatedMessage];
      });
    }
  };

  const handleQuery = async (message: MessagePro) => {

    if (isFirstMessage) {
      var updatedMessages: MessagePro[] = [message]
      setIsFirstMessage(false);
    }
    else {
      var updatedMessages: MessagePro[] = [...messages, message]
    }

    setLoading(true);
    setMessages(updatedMessages);

    let response = await fetch('/api/chat-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message.parts[0].content }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    response.json().then((data) => {
      handleQueryResponse(data, updatedMessages)
    })
  }

  const handleQueryResponse = async (response: any, updatedMessages: MessagePro[]) => {

    // Data sent to model (strings): ID [TYPE->DATA]
    let dataForModel: MessagePro[] = []
    // Data sent to messages for visualizations (objects): TYPE->DATA
    let dataForVisualizations: Record<string, any> = {}
    // Duration counter
    let timeDuration = 0
    console.log(response)
    // Dedicated analysis
    if (response.completion && response.segments.length > 0) {
      console.log("response:\n", response)
      console.log("chatData:\n", chatData)
      //@ts-ignore
      for (const [index, s] of response.segments.entries()) {
        timeDuration += (s.end - s.start)
        let stringDataForModel: Record<string, string> = {}
        let objectDataForVisualizations: Record<string, any> = {}
        if (timeDuration <= 20) {
          // Header
          stringDataForModel[`ID:${s.start}${s.end}`] = `Segment from ${s.start}-${s.end} seconds:`;

          // File 
          objectDataForVisualizations['audi'] = { file: chatData?.file?.file, start: s.start, end: s.end }


          // MIDI
          if (response.notes && chatData?.midi) {
            console.log("MIDI")
            const filteredMidi: NoteEventTime[] = filterAndAdjustNotesByTime(chatData?.midi as NoteEventTime[], s.start, s.end)
            objectDataForVisualizations['midi'] = generateFileData(filteredMidi)

            const modelMidi: string = formatCategorizeStringifyNotesForModel(filteredMidi)
            stringDataForModel['midi'] = modelMidi
            console.log(modelMidi)

          }

          // Prod
          if (response.prodFeatures && chatData?.prod) {
            // have global and local extraction, in conjunction with CAAS
            stringDataForModel['prod'] =
              `COMPRESSION
                Dynamic Complexity: ${chatData?.prod.dynamicComplexity}, Dynamic Complexity Loudness: ${chatData?.prod.dynamicComplexityLoudness}
                Dynamic Complexity is the average absolute deviation from the global loudness level estimate on the dB scale. It measures the amount of fluctuation in loudness in a recording
                
                Loudness: ${chatData?.prod.loudness}
                Computes loudness based on Steven's power law, which calculates loudness as the energy of the signal raised to the power of 0.67
                
              STEREO IMAGE
                Panning Score: ${chatData?.prod.panningScore} 
                The panning score is the panning coefficient for stereo audio, reflecting the relative energy balance between the left and right channels. The coefficient (-1 to 1) indicates the stereo image's direction: -1 for full left, 1 for full right, and 0 for centered`
          }

          // Spectral
          if (response.spectralFeatures && chatData?.graph) {
          }

          // change it to types of data which can aid model AND provide visualizations (same as midi) ??
          if (response.spectralFeatures && chatData?.graph) {
            const audioFrame = chatData.graph.frame.slice(s.start * chatData.graph.sampleRate, s.end * chatData.graph.sampleRate)
            const essentiaInstance = await Essentia.init(EssentiaWASM, true);
            const essentiaExtractor = new EssentiaExtractor(essentiaInstance, true);
            const hpcp = essentiaExtractor.hpcpExtractor(audioFrame);
            const melSpectrum = essentiaExtractor.melSpectrumExtractor(audioFrame);

            objectDataForVisualizations['hpcp'] = hpcp
            objectDataForVisualizations['mels'] = melSpectrum

            const labels = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            stringDataForModel['hpcp'] = Array.from(hpcp).map((value, index) => `${value}${labels[index]}`).join(' ');
            stringDataForModel['mels'] = Array.from(melSpectrum).map(value => Math.round(value as number * 1000) / 1000).join(' ');

            console.log('objectDataForVisualizations', objectDataForVisualizations)
            console.log('stringDataForModel', stringDataForModel)
          }

          // Download
          if (response.download) { }
          // 2 types of data retreival
          // CQT
          if (response.cqt) { }

          dataForVisualizations[`${s.start}${s.end}`] = objectDataForVisualizations
          dataForModel.push({
            role: 'user',
            parts: [
              {
                type: 'data',
                content: Object.entries(stringDataForModel).map(([key, value]) => `${key} ${value}`).join(' ')
              }
            ]
          } as MessagePro)

        } else {
          dataForModel.push({
            role: 'user',
            parts: [
              {
                type: 'data',
                content: `Since the users requested segment: "${s.start}-${s.end} seconds" exceeds 20 seconds, you will not receive data for analysis; but you can still provide visualizations for segments longer than 20 seconds.`
              }
            ]
          } as MessagePro)
          //break - change loop
        }
      };
      var updatedMessages = [...updatedMessages, ...dataForModel];
    }
    // General analysis
    else {

      let stringDataForModel: Record<string, string> = {}

      if (response.prodFeatures && chatData?.prod) {
        // have global and local extraction, in conjunction with CAAS
        stringDataForModel['prod'] =
          `COMPRESSION
            Dynamic Complexity: ${chatData?.prod.dynamicComplexity}, Dynamic Complexity Loudness: ${chatData?.prod.dynamicComplexityLoudness}
            Dynamic Complexity is the average absolute deviation from the global loudness level estimate on the dB scale. It measures the amount of fluctuation in loudness in a recording
            
            Loudness: ${chatData?.prod.loudness}
            Computes loudness based on Steven's power law, which calculates loudness as the energy of the signal raised to the power of 0.67
            
          STEREO IMAGE
            Panning Score: ${chatData?.prod.panningScore} 
            The panning score is the panning coefficient for stereo audio, reflecting the relative energy balance between the left and right channels. The coefficient (-1 to 1) indicates the stereo image's direction: -1 for full left, 1 for full right, and 0 for centered`
      }

      dataForModel.push({
        role: 'user',
        parts: [
          {
            type: 'data',
            content: Object.entries(stringDataForModel).map(([key, value]) => `${key} ${value}`).join(' ')
          }
        ]
      } as MessagePro)

      var updatedMessages = [...updatedMessages, ...dataForModel];
    }

    handleSend(updatedMessages, dataForVisualizations, response.completion)
  }

  const handleInitialData = () => {
    const initialData = {
      role: 'data',
      parts: [
        {
          type: 'data',
          content: `Initial data. File name: ${chatData?.file.name}, Duration: ${chatData?.graph.duration} seconds, Sample rate: ${chatData?.graph.sampleRate}`
        }
      ]
    } as MessagePro
    return initialData;
  }

  return (
    <>
      <div className={`h-full mx-auto pt-4 mb-4 ${currentState === ProState.chat ? 'max-w-[1200px]' : 'max-w-[800px]'}`}>
        {
          currentState != ProState.chat ?

            <div className="bg-on-surface rounded-lg p-4 mt-4">
              <div className="justify-center bg-surface p-6 flex flex-row items-center gap-4 rounded-lg">
                <Waveform width={70} height={30} color="#e1e3e3" />
                <div className="text-lg font-bold text-on-surface">
                  {
                    currentState == ProState.menu ?
                      <>Please enter your OpenAI API key</>
                      : currentState == ProState.upload ?
                        <>Please upload your audio file...</>
                        : currentState == ProState.convert ?
                          <>What would you like to talk about?</>
                          : currentState == ProState.loading ?
                            <>Listening to the Song...</>
                            : currentState == ProState.instructions ?
                              <>How to interact with me</>
                              : <></>
                  }
                </div>
              </div>
              <div className='flex flex-col -mt-6 bg-surface justify-center p-4 items-center w-full min-h-[200px] rounded-b-lg text-on-surface cursor-pointer transition-all duration-200'>
                {
                  currentState == ProState.menu ?
                    <ApiKey setCurrentState={setCurrentState} setAPIKey={setAPIKey} />
                    : currentState == ProState.upload ?
                      <Upload
                        setChatData={setChatData as Dispatch<SetStateAction<ChatData>>}
                        chatData={chatData as ChatData}
                        setParentState={setCurrentState as Dispatch<SetStateAction<ProState>>}
                      />
                      : currentState == ProState.convert || currentState == ProState.loading ?
                        <AudioSelection
                          setChatData={setChatData as Dispatch<SetStateAction<ChatData>>}
                          chatData={chatData as ChatData}
                          setParentState={setCurrentState as Dispatch<SetStateAction<ProState>>}
                        />
                        : currentState == ProState.instructions ?
                          <div className="sm:p-4 flex w-full flex-col">
                            <Instructions />
                            <div onClick={() => { setCurrentState(ProState.chat) }} className="w-full mt-2 text-tertiary-container text-center bg-tertiary rounded-lg p-4">
                              Continue
                            </div>
                          </div>
                          : <></>
                }
              </div>
            </div>
            :
            <>
              <ChatBox
                messagesPro={messages}
                loading={loading}
                onSendPro={handleQuery}
                onReset={() => { }}
                messagesEndRef={messagesEndRef}
                filename={chatData?.file?.name as string}
              />
            </>
        }

      </div>
    </>
  );
};


export default ProChat;
