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
  ChatData
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
import { Pro } from "@/components/Features/Features";

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
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessagePro[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatData, setChatData] = useState<ChatData>()

  const removeFileExtension = (filename: string): string => {
    if (typeof (filename) !== 'string') return ''
    const lastIndex = filename.lastIndexOf(".");
    return lastIndex !== -1 ? filename.slice(0, lastIndex) : filename;
  }

  useEffect(() => {
    if (currentState === ProState.convert) {
      setMessages([
        {
          role: "assistant",
          parts: [{ type: 'text', content: `Hello! I'm MusicGPT Pro, your AI music assistant. I am currently in Beta, so I might produce inacurate information. Let's talk about ${removeFileExtension(chatData?.file?.name as string)}. What would you like to know?` }]
        }
      ]);
    }
  }, [currentState, chatData])

  const filterAndAdjustNotesByTime = (notes: NoteEventTime[], startTime: number, endTime: number): NoteEventTime[] => {
    return notes
      .filter(note => note.startTimeSeconds >= startTime && note.startTimeSeconds <= endTime)
      .map(note => ({
        ...note,
        startTimeSeconds: note.startTimeSeconds - startTime,
      }));
  };

  const formatCategorizeStringifyNotesForModel = (
    notes: NoteEventTime[],
    decimalPlaces: number = 3
  ): string => {
    // Initialize the categorizedNotes object
    const categorizedNotes: { [key: string]: any[] } = {
      "Bass": [],
      "Mid-range": [],
      "High-range": [],
      "Uncategorized": [],
    };

    // Map notes to the new format, categorize, and add them to the categorizedNotes object
    notes.forEach((note) => {
      const { pitchBends, ...filteredNote } = note; // Removes pitchBends property
      const formattedNote = {
        s: parseFloat(note.startTimeSeconds.toFixed(1)),
        d: parseFloat(note.durationSeconds.toFixed(decimalPlaces)),
        p: note.pitchMidi,
        a: parseFloat(note.amplitude.toFixed(decimalPlaces)),
      };

      let category: string;

      if (formattedNote.p >= 24 && formattedNote.p <= 48) {
        category = "Bass";
      } else if (formattedNote.p >= 49 && formattedNote.p <= 72) {
        category = "Mid-range";
      } else if (formattedNote.p >= 73 && formattedNote.p <= 96) {
        category = "High-range";
      } else {
        category = "Uncategorized";
      }
      // Stringify the resulting array
      const jsonString = JSON.stringify(formattedNote);
      const reducedString = jsonString
        .replace(/[{}",]/g, "")
      categorizedNotes[category].push(reducedString);
    });

    return JSON.stringify(categorizedNotes).replace(/["]/g, "");
  };

  function convertMessageProToMessage(messagesPro: MessagePro[]): Message[] {
    return messagesPro.map((messagePro) => {
      const content = messagePro.parts
        .filter((part) => part.type === 'text' || part.type === 'data')
        .map((part) => part.content)
        .join(' ');

      return {
        role: messagePro.role,
        content,
      };
    });
  }

  const handleSend = async (updatedMessages: MessagePro[], dataForVisualizations: Record<string, any>, parse: boolean) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: convertMessageProToMessage(updatedMessages),
        chatMode: "pro",
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


    const commandParser = new CommandParser(dataForVisualizations)
    let parts: MessagePart[] | null = null;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      // const parts = parseTextStream(chunkValue);

      if (parts = commandParser.receiveAndProcessText(chunkValue)) {
        // console.log("parts:", parts);

        if (isFirst) {
          isFirst = false;
          setMessages((messages) => [
            ...messages,
            {
              role: "assistant",
              parts: parts as MessagePart[],
            },
          ]);
        } else {
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];
            const updatedMessage = {
              ...lastMessage,
              parts: [...lastMessage.parts, ...parts as MessagePart[]],
            };
            return [...messages.slice(0, -1), updatedMessage];
          });
        }
      }
    }
    setMessages((messages) => {
      const lastMessage = messages[messages.length - 1];
      const updatedMessage = {
        ...lastMessage,
        parts: [...lastMessage.parts, ...commandParser.getBuffer()],
      };
      return [...messages.slice(0, -1), updatedMessage];
    });


  };

  const handleQuery = async (message: MessagePro) => {
    setLoading(true);
    const updatedMessages: MessagePro[] = [...messages, message]
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
    if (response.completion && response.segments.length > 0) {
      console.log(response)
      //@ts-ignore
      // await response.segments.forEach(async (s, index: number) => {
      for (const [index, s] of response.segments.entries()) {
        timeDuration += (s.end - s.start)
        let stringDataForModel: Record<string, string> = {}
        let objectDataForVisualizations: Record<string, any> = {}

        if (timeDuration <= 20) {
          // Header
          stringDataForModel[`ID:${index}`] = `Segment from ${s.start}-${s.end} seconds:`;

          // File 
          objectDataForVisualizations['audi'] = { file: chatData?.file?.file, start: s.start, end: s.end }

          // MIDI
          if (response.notes && chatData?.midi) {
            const filteredMidi: NoteEventTime[] = filterAndAdjustNotesByTime(chatData?.midi as NoteEventTime[], s.start, s.end)
            objectDataForVisualizations['midi'] = generateFileData(filteredMidi)

            const modelMidi: string = formatCategorizeStringifyNotesForModel(filteredMidi)
            stringDataForModel['midi'] = modelMidi
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

          dataForVisualizations[`${index}`] = objectDataForVisualizations
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
                content: `Apologise to the user as their "${s.start}-${s.end} seconds" segment request has exceeded their maximum of 20 seconds data analysis per message`
              }
            ]
          } as MessagePro)
          //break - change loop
        }
      };
      console.log(updatedMessages)
      var updatedMessages = [...updatedMessages, ...dataForModel];
    }

    handleSend(updatedMessages, dataForVisualizations, response.completion)
  }

  const handleGlobalData = () => {
    // if (isFirstMessage) {
    //   const initData: string[] = []

    //   initData.push()

    //   const initialData = {
    //     role: 'data',
    //     parts: [
    //       {
    //         type: 'data',
    //         content: initData.join(' ')
    //       }
    //     ]
    //   } as MessagePro
    //   updatedMessages = [initialData, ...updatedMessages]
    //   setIsFirstMessage(false)
    // }
  }

  async function temp() {
    // function convert1Dto2DArray(float32Array: Float32Array, sliceSize: number) {
    //   let slices = [];
    //   for (let i = 0; i < float32Array.length; i += sliceSize) {
    //     slices.push(Array.from(float32Array.slice(i, i + sliceSize)));
    //   }
    //   return slices;
    // }
    // const essentiaInstance = await Essentia.init(EssentiaWASM, true);
    // console.log("WASM essentiaInstance")
    // const essentiaExtractor = new EssentiaExtractor(essentiaInstance, true);
    // console.log("essentiaExtractor")

    // const audioData = await fileProps.file.arrayBuffer();
    // const audioContext = new AudioContext();
    // const originalBuffer = await audioContext.decodeAudioData(audioData);
    // console.log("Buffer")

    // const audioFrame = essentiaInstance.audioBufferToMonoSignal(originalBuffer) // fill this with data from your .wav file
    // console.log("audioFrame", audioFrame)
    // const hpcp = essentiaExtractor.hpcpExtractor(audioFrame);
    // console.log("hpcp", hpcp)
    // setHpcp(hpcp)
    // const melSpectrum = essentiaExtractor.melSpectrumExtractor(audioFrame);
    // console.log("melSpectrum", melSpectrum)
    // setMel(melSpectrum)

    // // const something = essentiaInstance.FrameGenerator(audioFrame)
    // // console.log('something', essentiaInstance.vectorToArray(something))

    // const audioFrames = convert1Dto2DArray(audioFrame, 1024);
    // setFrames(audioFrames)


  }

  return (
    <>
      <div className="flex flex-col sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto sm:mt-4">

        <div className="justify-center bg-on-surface p-4 flex flex-row items-center gap-4 rounded-t-lg mb-2">

          {currentState != ProState.chat ?
            <Waveform width={70} height={40} color="#191c1d" />
            :
            <></>
          }
          <div className="text-lg font-bold text-surface">
            {
              currentState == ProState.menu ?
                <>Please enter your product key</>
                : currentState == ProState.upload ?
                  <>Please upload your audio file...</>
                  : currentState == ProState.convert ?
                    <>What would you like to talk about?</>
                    : currentState == ProState.loading ?
                      <>Listening to the Song...</>
                      : currentState == ProState.instructions ?
                        <>How to interact with me</>
                        : currentState == ProState.chat ?
                          <div className="text-3xl mb-2"> {removeFileExtension(chatData?.file?.name as string)}</div>
                          : <></>
            }
          </div>
        </div>
        {
          currentState != ProState.chat ?
            <div className='-mt-4 bg-surface flex flex-col justify-center mb-4 items-center w-full min-h-[200px] border-outline sm:border-x sm:border-b rounded-lg text-on-surface cursor-pointer transition-all duration-200'>
              {
                currentState == ProState.menu ?
                  <Form.Root className="w-[260px]"
                    onSubmit={(event) => {
                      const data = Object.fromEntries(new FormData(event.currentTarget));
                      const validKeys = ['1234', '458-225-928', '567-823-233', '901-200-221'];
                      if (validKeys.includes(data.key as string)) {
                        setCurrentState(ProState.upload)
                      }
                      event.preventDefault();
                    }}>
                    <Form.Field className="grid mb-[10px]" name="key">
                      <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px] text-on-surface">Key</Form.Label>
                        <Form.Message className="text-[13px] text-on-surface opacity-[0.8]" match="valueMissing">
                          Please enter your product key
                        </Form.Message>
                        <Form.Message className="text-[13px] text-on-surface opacity-[0.8]" match="typeMismatch">
                          Please provide a key
                        </Form.Message>
                      </div>
                      <Form.Control asChild>
                        <input
                          className="box-border w-full border border-outline bg-surface inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-on-surface outline-none selection:color-white selection:bg-outline"
                          type="password"
                          required
                        />
                      </Form.Control>
                    </Form.Field>
                    <Form.Submit asChild>
                      <button className="box-border w-full text-surface inline-flex h-[35px] items-center justify-center rounded-md bg-on-surface px-[15px] font-medium leading-non focus:outline-none mt-[10px]">
                        Submit
                      </button>
                    </Form.Submit>
                  </Form.Root>
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
            </div> : <></>
        }
        <div className="-mt-4">
          {
            currentState == ProState.chat ?
              <ChatBox
                messagesPro={messages}
                loading={loading}
                onSendPro={handleQuery}
                onReset={() => { }}
                messagesEndRef={messagesEndRef}
              />
              : <></>
          }
        </div>
      </div>

    </>
  );
};


export default ProChat;
