import { ChatBox } from "@/components/Chat/ChatBox";
import { Footer } from "@/components/Layout/Footer";
import { Message, HighLevelData, LowLevelData, GeniusFormattedData, LoadingState, Role, LoaderType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { useHiddenData } from "@/utils/context/song_data_context";
import axios from 'axios';
import SmallLoader from "@/components/Loaders/SmallLoader";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  CaretDownIcon,
} from '@radix-ui/react-icons';

interface MusicBrainz {
  lowLevel: LowLevelData | null,
  highLevel: HighLevelData | null
}

type GeniusModelData = {
  artist_names: string,
  description: string,
  full_title: string,
  lyrics: string,
};

type GeniusUserData = {
  full_title: string,
  embed_content: string,
  apple_music_player_url: string,
  header_image_thumbnail_url: string,
}

type ModelData = {
  genius: GeniusModelData,
  musicBrainz: MusicBrainz | null
}

export default function Chat() {
  const router = useRouter();

  // ids
  const [musicBrainzId, setMusicBrainzId] = useState<string>("")
  const [geniusId, setGeniusId] = useState<string>("")

  // data types
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [geniusUserData, setGeniusUserData] = useState<GeniusUserData | null>(null);
  const [lowLevelData, setLowLevelData] = useState<LowLevelData | null>(null)
  const [highLevelData, setHighLevelData] = useState<HighLevelData | null>(null)
  const [geniusData, setGeniusData] = useState<GeniusFormattedData | null>(null)

  //data loading states
  // global 
  const [pageInit, setPageInit] = useState<Boolean>(false)
  const [dataState, setDataState] = useState<LoadingState>(LoadingState.loading)
  const [isFirstMessage, setIsFirstMessage] = useState<Boolean>(true)
  // local
  const [lowLevelState, setLowLevelState] = useState<LoadingState>(LoadingState.loading);
  const [highLevelState, setHighLevelState] = useState<LoadingState>(LoadingState.loading);
  const [geniusState, setGeniusState] = useState<LoadingState>(LoadingState.loading);

  // messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // hidden data
  const { hiddenData, setHiddenData } = useHiddenData();

  const defaultMessage: Message = {
    role: "assistant",
    content: `Hello! I'm MusicGPT, your AI music assistant. I can help you explore the musical structure, lyrics, and cultural relevance of songs. Let's talk about ${geniusUserData?.full_title}! What would you like to know?`
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getLowLevelData = async (music_brainz_id: string) => {
    let music_brainz_low = null
    try {
      const response = await axios.get(`/api/lld?mbid=${encodeURIComponent(music_brainz_id)}`);
      music_brainz_low = response.data as LowLevelData
      setLowLevelState(LoadingState.finished)
    } catch (error) {
      setLowLevelState(LoadingState.failed)
    }
    return music_brainz_low
  }

  const getHighLevelData = async (music_brainz_id: string) => {
    let music_brainz_high = null
    try {
      const response = await axios.get(`/api/hld?mbid=${encodeURIComponent(music_brainz_id)}`);
      music_brainz_high = response.data as HighLevelData
      setHighLevelState(LoadingState.finished)
    } catch (error) {
      setHighLevelState(LoadingState.failed)
    }
    return music_brainz_high
  }

  const getGeniusData = async (genius_id: string) => {
    let genius_data = null
    try {
      const response = await axios.get(`/api/genius-song?id=${encodeURIComponent(genius_id)}`);
      genius_data = response.data as GeniusFormattedData
      setGeniusState(LoadingState.finished)
    } catch (error) {
      setGeniusState(LoadingState.failed)
      console.log(error);
    }
    return genius_data
  }

  const handleSend = async (message: Message) => {

    if (isFirstMessage) {
      let dataMessage: Message = { 'role': 'data', 'content': `Data: ${JSON.stringify(modelData).replace(/\//g, '')}` }
      var updatedMessages = [dataMessage, message]
      setIsFirstMessage(false);
    }
    else {
      var updatedMessages = [...messages, message];
    }

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages,
        chatConf: {
          chatMode: "lite",
          apiKey: ""
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const setData = () => {
    if (geniusData) {
      setGeniusUserData({
        full_title: geniusData.full_title,
        embed_content: geniusData.embed_content,
        apple_music_player_url: geniusData.apple_music_player_url,
        header_image_thumbnail_url: geniusData.header_image_thumbnail_url,
      }
      );

      setModelData({
        genius: {
          full_title: geniusData.full_title,
          lyrics: geniusData.lyrics,
          description: geniusData.description,
          artist_names: geniusData.artist_names,
        },
        musicBrainz: {
          lowLevel: lowLevelData,
          highLevel: highLevelData
        }
      });
      setDataState(LoadingState.finished)
    }
    else {
      setDataState(LoadingState.failed)
    }
  }

  useEffect(() => {
    const initData = async () => {
      const { genius, music_brainz } = router.query;

      if (!genius || typeof genius !== 'string' || typeof music_brainz !== 'string') {
        console.log("Genius or MusicBrainz not loaded");
        return;
      }

      setPageInit(true)
      setGeniusId(genius)
      setMusicBrainzId(music_brainz)

      if (hiddenData && hiddenData.id == music_brainz && hiddenData.genius) {
        setGeniusData(hiddenData.genius)
        setGeniusState(LoadingState.finished)
      } else {
        setGeniusData(await getGeniusData(genius));
      }
    }

    initData()
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init low level data
  useEffect(() => {
    const initLow = async () => {
      if (hiddenData && hiddenData.id == musicBrainzId && hiddenData.low_level) {
        setLowLevelData(hiddenData.low_level)
        setLowLevelState(LoadingState.finished)
      }
      else {
        setLowLevelData(await getLowLevelData(musicBrainzId))
      }
    }

    if (geniusState === LoadingState.finished) {
      initLow()
    }
    else if (geniusState === LoadingState.failed) {
      setDataState(LoadingState.failed)
    }

  }, [geniusState]) // eslint-disable-line react-hooks/exhaustive-deps

  // init high level data
  useEffect(() => {
    const initHigh = async () => {
      // to prevent time out
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (hiddenData && hiddenData.id == musicBrainzId && hiddenData.high_level) {
        setHighLevelData(hiddenData.high_level)
        setHighLevelState(LoadingState.finished)
      } else {
        setHighLevelData(await getHighLevelData(musicBrainzId))
      }
    }

    if (lowLevelState === LoadingState.finished) {
      initHigh()
    }
    else if (lowLevelState === LoadingState.failed) {
      setData()
    }

  }, [lowLevelState]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (highLevelData) {
      setData()
    }
  }, [highLevelData]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMessages([defaultMessage]);
  }, [geniusUserData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setMessages([defaultMessage]);
  };

  return (
    <>
      {!pageInit ? (
        <div>Loading...</div>
      ) : (
        <>
          {
            dataState === LoadingState.loading ? (
              <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg p-4">
                  <SmallLoader height={25} width={50} waveformColor={'--md-sys-color-on-secondary'} textColor={'on-secondary'} bgColor={'secondary'}
                    contents={[
                      { text: 'Obtaining cultural goodness', loadingState: geniusState, loaderType: LoaderType.waveform },
                      { text: 'Retrieving complex musical data', loadingState: lowLevelState, loaderType: LoaderType.waveform },
                      { text: 'Looking for general information', loadingState: highLevelState, loaderType: LoaderType.waveform }
                    ]} />
                </div>
              </div>
            ) : dataState === LoadingState.failed ? (
              <div className="text-error bg-error-container p-4 text-center rounded-lg">Error</div>
            ) : (
              <div className="flex flex-col sm:px-10 pb-4 sm:pb-10 max-w-[1200px] mx-auto sm:mt-4">
                <div className="w-full flex relative justify-center items-center flex-row gap-4 text-center text-on-surface font-bold text-4xl mb-4 px-4">
                  <div>{geniusUserData?.full_title}</div>
                  <div className="absolute top-0 right-0 mr-2 sm:mr-0">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center text-violet11 bg-secondary outline-none"
                          aria-label="Customise options"
                        >
                          <CaretDownIcon
                            className={`relative top-[1px] transition-transform duration-[250] ease-in text-on-secondary`}
                            aria-hidden
                          />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[220px] bg-secondary rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                          sideOffset={5}
                        >
                          <SmallLoader height={25} width={50} waveformColor={'--md-sys-color-on-secondary'} textColor={'on-secondary'} bgColor={'secondary'}
                            contents={[
                              { text: 'Cultural data', loadingState: geniusState, loaderType: LoaderType.waveform },
                              { text: 'Musical data', loadingState: lowLevelState, loaderType: LoaderType.waveform },
                              { text: 'General information', loadingState: highLevelState, loaderType: LoaderType.waveform }
                            ]} />
                          <DropdownMenu.Arrow className="fill-white" />
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
                <ChatBox
                  messages={messages}
                  loading={loading}
                  onSend={handleSend}
                  onReset={handleReset}
                  messagesEndRef={messagesEndRef}
                />
              </div>
            )
          }
        </>
      )
      }
    </>
  );
}
