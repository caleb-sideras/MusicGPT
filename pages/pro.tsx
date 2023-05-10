import { useEffect, useState, useRef } from "react";
import {
  BasicPitch, addPitchBendsToNoteEvents,
  NoteEventTime,
  noteFramesToTime,
  outputToNotesPoly,
  OnCompleteCallback,
  generateFileData,
} from "@/utils/basic-pitch-ts/src";
import { Midi, Track } from "@tonejs/midi";
import * as tf from '@tensorflow/tfjs';
import dynamic from 'next/dynamic';
import { ChatBox } from "@/components/Chat/ChatBox";
import SmallLoader from "@/components/Loaders/SmallLoader";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  CaretDownIcon,
} from '@radix-ui/react-icons';
import { Message, MessagePart, MessagePro } from "@/types";
import axios from 'axios';
import CommandParser from "@/utils/commandParser";

const PlayerElement = dynamic(
  () => import('@/components/MusicPlayer/ReactPlayer').then((mod) => mod.default),
  { ssr: false, loading: () => <p>Loading PlayerElement...</p> }
);

export interface VisualizerConfig {
  noteHeight?: number;
  noteSpacing?: number;
  pixelsPerTimeStep?: number;
  noteRGB?: string;
  activeNoteRGB?: string;
  minPitch?: number;
  maxPitch?: number;
}


const UploadMidiConverter: React.FC = () => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>();
  const [frames, setFrames] = useState<number[][]>([]);
  const [onsets, setOnsets] = useState<number[][]>([]);
  const [contours, setContours] = useState<number[][]>([]);
  const [pct, setPct] = useState<number>(0);
  const [fileData, setFileData] = useState<Buffer>()
  const [finished, setFinished] = useState<boolean>(false)
  const [currentMidi, setCurrentMidi] = useState<Midi | null>(null);
  const [messages, setMessages] = useState<MessagePro[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFirstMessage, setIsFirstMessage] = useState<Boolean>(true)

  const [songMidi, setSongMidi] = useState<NoteEventTime[]>()
  const [onlineData, setonlineData] = useState<string>('')

  const defaultMessage: MessagePro = {
    role: "assistant",
    parts: [{ type: 'text', content: "Hello! I'm MusicGPT, your AI music assistant. I can help you explore the musical structure, lyrics, and cultural relevance of songs. Let's talk about ASDASDASD! What would you like to know?" }]
  }

  useEffect(() => {
    setMessages([defaultMessage,
      {
        role: "user",
        parts: [{ type: "text", content: "My name is Caleb Sideras and today I want to ask you some questions!" }]
      }
    ]);

  }, [])

  useEffect(() => {
    console.log(`frames ${frames.length}`)
    console.log(`onsets ${onsets.length}`)
    console.log(`contours ${contours.length}`)
  }, [frames, onsets, contours])

  useEffect(() => {
    if (!finished) return;
    const midi = noteFramesToTime(
      // @param frames — : frame activation matrix(n_times, n_freqs)
      // @param onsets — : onset activation matrix(n_times, n_freqs)
      // @param onsetThresh — : minimum amplitude of an onset activation to be considered an onset
      // @param frameThresh — : minimum amplitude of a frame activation for a note to remain "on"
      // @param minNoteLen — : minimum allowed note length in frames
      // @param inferOnsets — : if True, add additional onsets when there are large differences in frame amplitudes
      // @param maxFreq — : maximum allowed output frequency, in Hz
      // @param minFreq — : minimum allowed output frequency, in Hz
      // @param melodiaTrick — : remove semitones near a peak
      // @param energyTolerance — : number of frames allowed to drop below 0
      addPitchBendsToNoteEvents(
        contours,
        outputToNotesPoly(frames, onsets, 0.6, 0.3, 11),
      ),
    );

    // const filteredMidi: NoteEventTime[] = filterAndAdjustNotesByTime(midi as NoteEventTime[], 10, 20)
    console.log(midi)
    setSongMidi(midi)
    setFileData(generateFileData(midi))

  }, [finished])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const audioContext = new AudioContext();
    const audioData = await file.arrayBuffer();
    const originalBuffer = await audioContext.decodeAudioData(audioData);
    console.log(`duration: ${originalBuffer.duration}`)
    console.log(`sampleRate: ${originalBuffer.sampleRate}`)
    console.log(`numberOfChannels: ${originalBuffer.numberOfChannels}`)
    // console.log(`getChannelData: ${originalBuffer.getChannelData(1)}`)
    console.log(`length: ${originalBuffer.length}`)
    console.log(`resampledBuffer ${originalBuffer}`)
    console.log("\n\n\n")
    const resamplingRate = 22050;

    if (originalBuffer.numberOfChannels !== 1 || originalBuffer.sampleRate !== resamplingRate) {
      // Create offline audio context to process and resample the audio
      const offlineCtx = new OfflineAudioContext(
        1, Math.ceil(originalBuffer.duration * resamplingRate), resamplingRate
      );

      // Create a buffer source
      const source = offlineCtx.createBufferSource();
      source.buffer = originalBuffer;

      // Merge and sum channels in a custom gain nodes summation 
      const gainNodes = Array.from({ length: originalBuffer.numberOfChannels }, (_, i) =>
        offlineCtx.createGain()
      );
      gainNodes.forEach((gainNode, i) => {
        source.connect(gainNode);
        gainNode.connect(offlineCtx.destination);
        gainNode.gain.value = 1 / originalBuffer.numberOfChannels;
      });

      // Begin offline rendering
      source.start(0);
      const resampledBuffer = await offlineCtx.startRendering();
      console.log(`duration: ${resampledBuffer.duration}`)
      console.log(`sampleRate: ${resampledBuffer.sampleRate}`)
      console.log(`numberOfChannels: ${resampledBuffer.numberOfChannels}`)
      // console.log(`getChannelData: ${resampledBuffer.getChannelData(1)}`)
      console.log(`length: ${resampledBuffer.length}`)
      console.log(`resampledBuffer ${resampledBuffer}`)
      setAudioBuffer(resampledBuffer);
    } else {
      setAudioBuffer(originalBuffer);
    }
  };

  const handleConvertToMidi = async () => {
    if (!audioBuffer) return;
    const basicPitch = new BasicPitch(
      // tf.loadGraphModel(`file://${modelPath}`),
      tf.loadGraphModel('./model.json'),
      // `file://${modelPath}/model.json`
    );
    await basicPitch.evaluateModel(
      audioBuffer,
      (f: number[][], o: number[][], c: number[][]) => {
        setFrames((prevFrames) => [...prevFrames, ...f]);
        setOnsets((prevOnsets) => [...prevOnsets, ...o]);
        setContours((prevContours) => [...prevContours, ...c]);
      },
      (p: number) => {
        setPct(p);
      }
    );
    setFinished(true)
  };

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
        .map((part) => part.content)
        .join(' ');

      return {
        role: messagePro.role,
        content,
      };
    });
  }

  const handleSend = async (message: MessagePro, midiData?: string, start?: number, end?: number) => {

    var updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    if (midiData) {
      let dataMessage: MessagePro = { role: 'user', parts: [{ type: 'data', content: `The following in a lossy MIDI extract ranging from ${start}-${end} seconds ${midiData}` }] };
      var updatedMessages = [...updatedMessages, dataMessage];
    }

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


    const commandParser = new CommandParser()
    let parts: MessagePart[] | null = null;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      // const parts = parseTextStream(chunkValue);

      if (parts = commandParser.receiveAndProcessText(chunkValue)) {
        console.log("parts:", parts);

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
    setMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        parts: commandParser.getBuffer(),
      },
    ]);

    
  };

  const handleQuery = async (message: MessagePro) => {
    console.log(message.parts[0].content)
    console.log(message)
    let response = await fetch('/api/chat-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message.parts[0].content }),
    });

    response.json().then((data) => {
      console.log(data)
      handleQueryResponse(data, message)
    })
  }

  const handleQueryResponse = (response: any, message: MessagePro) => {
    if (response.completion = 'pass') {
      // forward user message to gpt-4
    }
    if (response.completion = 'good') {
      const isDownload = response.download
      const isAnyalsis = response.analysis
      // if just this playback - make more official
      const startTime = response.segment.start
      const endTime = response.segment.end
      // playback midi
      const filteredMidi: NoteEventTime[] = filterAndAdjustNotesByTime(songMidi as NoteEventTime[], startTime, endTime)
      console.log(filteredMidi)
      if (isAnyalsis) {
        // feed model
        const modelMidi: string = formatCategorizeStringifyNotesForModel(filteredMidi)
        handleSend(message, modelMidi, startTime, endTime)
      }

    }
    // check error response
  }


  return (
    <>
      <input className="text-on-surface" type="file" accept="audio/*" onChange={handleFileUpload} />
      <button className="text-on-surface" onClick={handleConvertToMidi} disabled={!audioBuffer}>
        Convert to MIDI
      </button>
      <div className="text-on-surface">Progress: {pct}%</div>
      <div className="flex flex-col sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto sm:mt-4">
        <div className="w-full flex relative justify-center items-center flex-row gap-4 text-center text-on-surface font-bold text-4xl mb-4 px-4">
          <div>ME GEAORGE</div>
        </div>
        <ChatBox
          messagesPro={messages}
          loading={loading}
          onSendPro={handleQuery}
          onReset={() => { }}
          messagesEndRef={messagesEndRef}
        />
        {/* <div ref={messagesEndRef} /> */}
      </div>
      <div>
        {fileData &&
          <PlayerElement
            buffer={fileData}
            soundFont=""
            loop={true}
          />
        }

      </div>
    </>
  );
};

export default UploadMidiConverter;
