import { ChatBox } from "@/components/Chat/ChatBox";
import { Footer } from "@/components/Layout/Footer";
import { Message, HighLevelData, LowLevelData, GeniusFormattedData, loadingState } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { useHiddenData } from "@/utils/context/song_data_context";
import axios from 'axios';
import LoadingPopup from "@/components/Songs/LoadingPopUp";

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
      // const response = await axios.get(`/api/hld?mbid=${encodeURIComponent(music_brainz_id)}`);
      // music_brainz_high = response.data as HighLevelData
      music_brainz_high = {
        "high_level": [
          {
            "probability": 0.949734270573,
            "value": "danceable"
          },
          {
            "probability": 0.994705021381,
            "value": "male"
          },
          {
            "probability": 0.986267387867,
            "value": "electronic"
          },
          {
            "probability": 0.5339884758,
            "value": "ambient"
          },
          {
            "probability": 0.38053175807,
            "value": "hip"
          },
          {
            "probability": 0.313974827528,
            "value": "jaz"
          },
          {
            "probability": 0.416245400906,
            "value": "Tango"
          },
          {
            "probability": 0.633097112179,
            "value": "not_acoustic"
          },
          {
            "probability": 0.781112909317,
            "value": "not_aggressive"
          },
          {
            "probability": 0.838694810867,
            "value": "electronic"
          },
          {
            "probability": 0.611337602139,
            "value": "not_happy"
          },
          {
            "probability": 0.671940028667,
            "value": "not_party"
          },
          {
            "probability": 0.576854407787,
            "value": "relaxed"
          },
          {
            "probability": 0.694295108318,
            "value": "not_sad"
          },
          {
            "probability": 0.270947486162,
            "value": "Cluster3"
          },
          {
            "probability": 0.96565002203,
            "value": "dark"
          },
          {
            "probability": 0.775041699409,
            "value": "atonal"
          },
          {
            "probability": 0.712734818459,
            "value": "voice"
          }
        ],
        "audio_properties": {
          "bit_rate": 320043,
          "length": 196.048980713,
          "replay_gain": -14.2629241943,
          "sample_rate": 44100
        }
      }
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
      // const response = await axios.get(`/api/genius-song?id=${encodeURIComponent(genius_id)}`);
      // genius_data = response.data as GeniusFormattedData
      genius_data = {
        "artist_names": "Kendrick Lamar",
        "apple_music_player_url": "https://genius.com/songs/3039923/apple_music_player",
        "description": "On the ironically braggadocious track “HUMBLE.” Kendrick Lamar challenges his competition. It was released a week after the first promotional single, “The Heart Part 4,” with a music video directed by Dave Meyers and The Little Homies. It features religious imagery mixed with urban life, such as Kendrick in priest’s robes and a moving re-enactment of Leonardo Da Vinci’s painting The Last Supper—juxtaposing this with the concept of humility in the chorus.\n\nOn a religious note, the song could also...",
        "embed_content": "<div id='rg_embed_link_3039923' class='rg_embed_link' data-song-id='3039923'>Read <a href='https://genius.com/Kendrick-lamar-humble-lyrics'>“HUMBLE.” by Kendrick Lamar</a> on Genius</div> <script crossorigin src='//genius.com/songs/3039923/embed.js'></script>",
        "full_title": "HUMBLE. by Kendrick Lamar",
        "header_image_thumbnail_url": "https://images.genius.com/ff22abdacf933fecfe39c9ad2a5fc441.300x153x1.jpg",
        "lyrics": "[Intro]\nNobody pray for meIt been that day for meWay (Yeah, yeah)\n\n[Verse 1]\nAyy, I remember syrup sandwiches and crime allowancesFinesse a nigga with some counterfeits, but now I'm countin’ this\nParmesan where my accountant lives, in fact, I'm downin' thisD’USSÉ with my boo bae, tastes like Kool-Aid for the analysts\nGirl, I can buy your ass the world with my paystub\nOoh, that pussy good, won't you sit it on my taste bloods?\nI get way too petty once you let me do the extrasPull up on your block,..."
      }
      setGeniusState(loadingState.finished)
    } catch (error) {
      setGeniusState(loadingState.failed)
      console.log(error);
    }
    return genius_data
  }

  const handleSend = async (message: Message) => {



    if (isFirstMessage) {
      let tempMessage: Message = { ...message }
      tempMessage.content = `Data: ${JSON.stringify(modelData).replace(/\//g, '')} Prompt: ${tempMessage.content}`;
      console.log(tempMessage);
      var updatedMessages = [...messages, tempMessage]
      setIsFirstMessage(false);
      console.log(updatedMessages)
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
      setGeniusUserData(
        geniusData ? {
          full_title: geniusData.full_title,
          embed_content: geniusData.embed_content,
          apple_music_player_url: geniusData.apple_music_player_url,
          header_image_thumbnail_url: geniusData.header_image_thumbnail_url,
        } : {
          // for testing
          full_title: "HUMBLE. by Kendrick Lamar",
          apple_music_player_url: "https://genius.com/songs/3039923/apple_music_player",
          embed_content: "<div id='rg_embed_link_3039923' class='rg_embed_link' data-song-id='3039923'>Read <a href='https://genius.com/Kendrick-lamar-humble-lyrics'>“HUMBLE.” by Kendrick Lamar</a> on Genius</div> <script crossorigin src='//genius.com/songs/3039923/embed.js'></script>",
          header_image_thumbnail_url: "https://images.genius.com/ff22abdacf933fecfe39c9ad2a5fc441.300x153x1.jpg",
        }
      );

      setModelData({
        genius: geniusData ? {
          full_title: geniusData.full_title,
          lyrics: geniusData.lyrics,
          description: geniusData.description,
          artist_names: geniusData.artist_names,
        } : {
          // for testing
          full_title: "HUMBLE. by Kendrick Lamar",
          artist_names: "Kendrick Lamar",
          description: "On the ironically braggadocious track “HUMBLE.” Kendrick Lamar challenges his competition. It was released a week after the first promotional single, “The Heart Part 4,” with a music video directed by Dave Meyers and The Little Homies. It features religious imagery mixed with urban life, such as Kendrick in priest’s robes and a moving re-enactment of Leonardo Da Vinci’s painting The Last Supper—juxtaposing this with the concept of humility in the chorus.\n\nOn a religious note, the song could also be a reference to the verse James 4:7.\n\nSo humble yourselves before God. Resist the devil, and he will flee from you.\"\n\n—Thus linking to April 7th, the date Kendrick told the industry to have their shit together.\n\nMike WiLL Made-It produced the beat. It features a deep piano riff and a banging 808 bass line. This style of production is a departure from the sound of Kendrick’s previous jazz-influenced project, To Pimp a Butterfly. It seems to reference the character Deebo’s theme song from the popular comedy movie Friday (1995). Kendrick is also shown riding through the neighborhood on a bicycle in the music video, similar to Deebo in Friday.\n\nThe song debuted at No. 2 on the Billboard Hot 100 on April 22, 2017, making it not only the highest charting song for Kendrick, but also one of the highest debuting hip-hop singles since “Love the Way You Lie” by Eminem. The song later hit No. 1 on the chart on June 5, 2017, making it Lamar’s first solo No. 1 song and second No. 1 song overall on the charts.",
          lyrics: "[Intro]\nNobody pray for meIt been that day for meWay (Yeah, yeah)\n\n[Verse 1]\nAyy, I remember syrup sandwiches and crime allowancesFinesse a nigga with some counterfeits, but now I'm countin’ this\nParmesan where my accountant lives, in fact, I'm downin' thisD’USSÉ with my boo bae, tastes like Kool-Aid for the analysts\nGirl, I can buy your ass the world with my paystub\nOoh, that pussy good, won't you sit it on my taste bloods?\nI get way too petty once you let me do the extrasPull up on your block, then break it down: we playin' TetrisAM to the PM, PM to the AM, funk\nPiss out your per diem, you just gotta hate 'em, funk\nIf I quit your BM, I still ride Mercedes, funk\nIf I quit this season, I still be the greatest, funk\nMy left stroke just went viralRight stroke put lil' baby in a spiral\nSoprano C, we like to keep it on a high noteIt's levels to it, you and I know\n[Chorus]\nBitch, be humble (Hol' up, bitch)Sit down (Hol' up, lil’, hol’ up, lil' bitch)Be humble (Hol’ up, bitch)Sit down (Hol' up, sit down, lil', sit down, lil' bitch)Be humble (Hol’ up, hol' up)Bitch, sit down (Hol' up, hol' up, lil' bitch)Be humble (Lil' bitch, hol' up, bitch)Sit down (Hol' up, hol' up, hol' up, hol' up)Be humble (Hol' up, hol' up)Sit down (Hol' up, hol' up, lil', hol' up, lil' bitch)Be humble (Hol' up, bitch)Sit down (Hol' up, sit down, lil', sit down, lil' bitch)Be humble (Hol' up, hol' up)Bitch, sit down (Hol' up, hol' up, lil' bitch)Be humble (Lil' bitch, hol' up, bitch)Sit down (Hol' up, hol' up, hol' up, hol' up)\n\n[Verse 2]\nWho that nigga thinkin' that he frontin' on Man-Man? (Man-Man)Get the fuck off my stage, I'm the Sandman (Sandman)\nGet the fuck off my dick, that ain't right\n\nI'm so fuckin' sick and tired of the PhotoshopShow me somethin' natural like afro on Richard PryorShow me somethin' natural like ass with some stretch marks\nStill I take you down right on your mama couch in Polo socks\nAyy, this shit way too crazy, ayy, you do not amaze me, ayyI blew cool from AC, ayy, Obama just paged me, ayyI don't fabricate it, ayy, most of y'all be fakin', ayyI stay modest 'bout it, ayy, she elaborate it, ayy\nThis that Grey Poupon, that Evian, that TED Talk, ayy\nWatch my soul speak, you let the meds talk, ayyIf I kill a nigga, it won't be the alcohol, ayyI'm the realest nigga after all\n[Chorus]\nBitch, be humble (Hol' up, bitch)Sit down (Hol' up, lil', hol' up, lil' bitch)Be humble (Hol' up, bitch)Sit down (Hol' up, sit down, lil', sit down, lil' bitch)Be humble (Hol' up, hol' up)Bitch, sit down (Hol' up, hol' up, lil' bitch)Be humble (Lil' bitch, hol' up, bitch)Sit down (Hol' up, hol' up, hol' up, hol' up)Be humble (Hol' up, hol' up)Sit down (Hol' up, hol' up, lil', hol' up, lil' bitch)Be humble (Hol' up, bitch)Sit down (Hol' up, sit down, lil', sit down, lil' bitch)Be humble (Hol' up, hol' up)Bitch, sit down (Hol' up, hol' up, lil' bitch)Be humble (Lil' bitch, hol' up, bitch)Sit down (Hol' up, hol' up, hol' up, hol' up)"
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
  }, [router.isReady]);

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

  }, [geniusState])

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
      setData()
    }

    if (lowLevelState === loadingState.finished) {
      initHigh()
    }
    else if (lowLevelState === loadingState.failed) {
      setData()
    }

  }, [lowLevelState])

  useEffect(() => {

  }, [dataState])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([defaultMessage, {
      role: "user",
      content: `My name is Caleb Sideras and today I want to ask you some questions!`
    }]);
  }, []);

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
              <LoadingPopup genius={geniusState} low={lowLevelState} high={highLevelState} />
            ) : dataState === loadingState.failed ? (
              <>Error</>
            ) : (
              <div className="flex flex-col max-h-[600px] sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto sm:mt-4">
                <div className="w-full flex justify-center flex-col text-center text-on-surface font-bold text-4xl mb-4">
                  <div>{geniusUserData?.full_title}</div>
                  {/* <div dangerouslySetInnerHTML={{ __html: geniusUserData?.embed_content as string }} /> */}
                  {/* <div className="w-full h-[80px] pt-4">
                        <iframe
                          src={geniusUserData?.apple_music_player_url}
                          title="Apple Music Player"
                          className="w-full h-full"
                        />
                      </div> */}
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
