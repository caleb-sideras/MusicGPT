import { ChatBox } from "@/components/Chat/ChatBox";
import { Footer } from "@/components/Layout/Footer";
import { Message, HighLevelData, LowLevelData, GeniusFormattedData, loadingState, Role } from "@/types";
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

  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState('pedro');

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
  const [dataState, setDataState] = useState<loadingState>(loadingState.loading)
  const [isFirstMessage, setIsFirstMessage] = useState<Boolean>(true) // true -> is first message, false -> is not first message
  // local
  const [lowLevelState, setLowLevelState] = useState<loadingState>(loadingState.loading);
  const [highLevelState, setHighLevelState] = useState<loadingState>(loadingState.loading);
  const [geniusState, setGeniusState] = useState<loadingState>(loadingState.loading);

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
      console.log(music_brainz_low)
      setLowLevelState(loadingState.finished)
    } catch (error) {
      setLowLevelState(loadingState.failed)
      console.log(error)
    }
    return music_brainz_low
  }

  const getHighLevelData = async (music_brainz_id: string) => {
    let music_brainz_high = null
    try {
      const response = await axios.get(`/api/hld?mbid=${encodeURIComponent(music_brainz_id)}`);
      music_brainz_high = response.data as HighLevelData
      // music_brainz_high = {
      //   "high_level": [
      //     {
      //       "probability": 0.949734270573,
      //       "value": "danceable"
      //     },
      //     {
      //       "probability": 0.994705021381,
      //       "value": "male"
      //     },
      //     {
      //       "probability": 0.986267387867,
      //       "value": "electronic"
      //     },
      //     {
      //       "probability": 0.5339884758,
      //       "value": "ambient"
      //     },
      //     {
      //       "probability": 0.38053175807,
      //       "value": "hip"
      //     },
      //     {
      //       "probability": 0.313974827528,
      //       "value": "jaz"
      //     },
      //     {
      //       "probability": 0.416245400906,
      //       "value": "Tango"
      //     },
      //     {
      //       "probability": 0.633097112179,
      //       "value": "not_acoustic"
      //     },
      //     {
      //       "probability": 0.781112909317,
      //       "value": "not_aggressive"
      //     },
      //     {
      //       "probability": 0.838694810867,
      //       "value": "electronic"
      //     },
      //     {
      //       "probability": 0.611337602139,
      //       "value": "not_happy"
      //     },
      //     {
      //       "probability": 0.671940028667,
      //       "value": "not_party"
      //     },
      //     {
      //       "probability": 0.576854407787,
      //       "value": "relaxed"
      //     },
      //     {
      //       "probability": 0.694295108318,
      //       "value": "not_sad"
      //     },
      //     {
      //       "probability": 0.270947486162,
      //       "value": "Cluster3"
      //     },
      //     {
      //       "probability": 0.96565002203,
      //       "value": "dark"
      //     },
      //     {
      //       "probability": 0.775041699409,
      //       "value": "atonal"
      //     },
      //     {
      //       "probability": 0.712734818459,
      //       "value": "voice"
      //     }
      //   ],
      //   "audio_properties": {
      //     "bit_rate": 320043,
      //     "length": 196.048980713,
      //     "replay_gain": -14.2629241943,
      //     "sample_rate": 44100
      //   }
      // }
      console.log(music_brainz_high)
      setHighLevelState(loadingState.finished)
    } catch (error) {
      setHighLevelState(loadingState.failed)
      console.log(error);
    }
    return music_brainz_high
  }

  const getGeniusData = async (genius_id: string) => {
    let genius_data = null
    try {
      const response = await axios.get(`/api/genius-song?id=${encodeURIComponent(genius_id)}`);
      genius_data = response.data as GeniusFormattedData
      console.log(genius_data)
      setGeniusState(loadingState.finished)
    } catch (error) {
      setGeniusState(loadingState.failed)
      console.log(error);
    }
    return genius_data
  }

  const handleSend = async (message: Message) => {

    if (isFirstMessage) {
      let dataMessage: Message = {'role': 'data', 'content': `Data: ${JSON.stringify(modelData).replace(/\//g, '')}`}
      // console.log(dataMessage);
      var updatedMessages = [...messages, dataMessage, message]
      setIsFirstMessage(false);
      // console.log(updatedMessages)
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
        messages: updatedMessages
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
    console.log("Set data called")
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
      setDataState(loadingState.finished)
    }
    else {
      setDataState(loadingState.failed)
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
        console.log("-----------------------------HIDDEN DATA TRUE-----------------------------")
        console.log(hiddenData)
        setGeniusData(hiddenData.genius)
        setGeniusState(loadingState.finished)
        console.log("Set genius from hidden")
      } else {
        setGeniusData(await getGeniusData(genius));
        console.log("Set genius")
      }
    }

    initData()
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init low level data
  useEffect(() => {
    const initLow = async () => {
      if (hiddenData && hiddenData.id == musicBrainzId && hiddenData.low_level) {
        setLowLevelData(hiddenData.low_level)
        setLowLevelState(loadingState.finished)
        console.log("Set low-level from hidden")
      }
      else {
        setLowLevelData(await getLowLevelData(musicBrainzId))
        console.log("Set low-level")
      }
    }

    if (geniusState === loadingState.finished) {
      initLow()
    }
    else if (geniusState === loadingState.failed) {
      setDataState(loadingState.failed)
    }

  }, [geniusState]) // eslint-disable-line react-hooks/exhaustive-deps

  // init high level data
  useEffect(() => {
    const initHigh = async () => {
      // to prevent time out
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (hiddenData && hiddenData.id == musicBrainzId && hiddenData.high_level) {
        setHighLevelData(hiddenData.high_level)
        setHighLevelState(loadingState.finished)
        console.log("Set high-level from hidden")
      } else {
        setHighLevelData(await getHighLevelData(musicBrainzId))
        console.log("Set high-level")
      }
    }

    if (lowLevelState === loadingState.finished) {
      initHigh()
    }
    else if (lowLevelState === loadingState.failed) {
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
    setMessages([defaultMessage,
      // {
      //   role: "user",
      //   content: `My name is Caleb Sideras and today I want to ask you some questions!`
      // }
    ]);
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
            dataState === loadingState.loading ? (
              <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg p-4">
                  <SmallLoader height={25} width={50} waveformColor={'--md-sys-color-on-secondary'} textColor={'on-secondary'} bgColor={'secondary'}
                    contents={[
                      { text: 'Obtaining cultural goodness', loading_state: geniusState },
                      { text: 'Retrieving complex musical data', loading_state: lowLevelState },
                      { text: 'Looking for general information', loading_state: highLevelState }
                    ]} />
                </div>
              </div>
            ) : dataState === loadingState.failed ? (
              <div className="text-error bg-error-container p-4 text-center rounded-lg">Error</div>
            ) : (
              <div className="flex flex-col sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto sm:mt-4">
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
                              { text: 'Cultural data', loading_state: geniusState },
                              { text: 'Musical data', loading_state: lowLevelState },
                              { text: 'General information', loading_state: highLevelState }
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
                {/* <div ref={messagesEndRef} /> */}
              </div>
            )
          }
        </>
      )
      }
    </>
  );
}
