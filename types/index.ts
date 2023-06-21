import { NoteEventTime } from "@/utils/basic-pitch-ts/src";


export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  GPT_4 = "gpt-4"
}

export interface Message {
  role: Role;
  content: string;
}

export type Role = "assistant" | "user" | "data";

export interface MusicBrainzApiResponse {
  created: string;
  count: number;
  offset: number;
  artists: {
    id: string;
    name: string;
    type: string;
    country: string;
    area: {
      id: string;
      name: string;
      sort_name: string;
      type: string;
    };
    life_span: {
      begin: string;
      end?: string;
      ended: boolean;
    };
    tags?: {
      count: number;
      tag: {
        name: string;
        count: number;
      }[];
    };
  }[];
}

export interface HiddenDataType {
  id: string | null;
  high_level: HighLevelData | null;
  low_level: LowLevelData | null;
  genius: GeniusFormattedData | null;
}

export interface GeniusFormattedData {
  artist_names: string;
  apple_music_player_url: string;
  description: string;
  embed_content: string;
  full_title: string;
  header_image_thumbnail_url: string;
  lyrics: string;
}

export interface GeniusSearchApiResponse {
  meta: {
    status: number;
  };
  response: {
    hits: {
      type: string;
      result: {
        id: number;
        title: string;
        url: string;
        header_image_thumbnail_url: string;
        header_image_url: string;
        path: string;
        primary_artist: {
          id: number;
          name: string;
          url: string;
        };
      };
    }[];
  };
}

export interface ArtistData {
  genius: GeniusSearchApiResponse;
  musicBrainz: any
}

export interface RateLimitInfo {
  limit: string;
  remaining: string;
  reset: string;
}

export type HighLevel = {
  probability: number;
  value: string;
};

export type AudioProperties = {
  bit_rate: number;
  length: number;
  replay_gain: number;
  sample_rate: number;
}

export type HighLevelData = {
  high_level: HighLevel[];
  audio_properties: AudioProperties;
}

export type LowLevelData = {
  lowlevel: {
    average_loudness: number,
    dynamic_complexity: number,
    mfcc_mean: number[], //mfcc
  },
  rhythm: {
    bpm: number,
    danceability: number,
    onset_rate: number,
    beats_count: number
  },
  tonal: {
    chords_changes_rate: number,
    // chords_histogram: number,
    chords_key: string,
    chords_number_rate: number,
    chords_scale: string,
    // chords_strength: number,
    key_key: string,
    key_scale: string,
    key_strength: number,
    // thpcp: number,
    tuning_diatonic_strength: number,
    tuning_equal_tempered_deviation: number,
    tuning_frequency: number,
    tuning_nontempered_energy_ratio: number,
  }

  metadata: {
    audio_properties: {
      analysis_sample_rate: number,
      replay_gain: number,
      length: number,
      bit_rate: number,
    }
    // tags: {
    //   album: string,
    //   albumartist: string,
    //   composer: string,
    //   date: string,
    //   genre: string,
    //   initialkey: string,
    //   language: string,
    //   title: string,
    // }
  }
}

export enum LoadingState {
  loading = 0,
  finished = 1,
  failed = 2
}

export enum Style {
  'default',
  'home',
  'lite',
  'pro'
}

export enum LoaderType {
  waveform = 1,
  progress = 2
}




/////////PRO///////////
export type ChatConf = {
  chatMode: 'pro' | 'lite'
  apiKey: string
}

export interface MessagePart {
  type: "text" | "data" | "midi" | "audi" | "wave" | "hpcp" | "mels" | "code" | "exec";
  content: Buffer | any;
}

export interface MessagePro {
  role: Role;
  parts: MessagePart[];
}

export interface MessageProData {
  midi: any; // will be of type -> maybe possible to group based on type
  audio: any; // will be of type
  waveform: any;
}

export interface FullMessagePro {
  messages: MessagePro[];
  data: MessageProData;

}

export enum ProState {
  menu = 0,
  upload = 1,
  convert = 2,
  loading = 3,
  instructions = 4,
  chat = 5
}

export type SelectionState = {
  midi: boolean
  prod: boolean

}

export type ChatData = {
  midi: NoteEventTime[]
  prod: ProdProps
  graph: GraphProps
  file: FileProps
}

export type ProdProps = {
  panningScore: number;
  dynamicComplexity: number;
  dynamicComplexityLoudness: number
  loudness: number;
}

export type GraphProps = {
  frame: Float32Array
  length: number
  sampleRate: number
  duration: number
}

export interface FileProps {
  arrayBuffer?: ArrayBuffer;
  name: string;
  file: File
}


/////////AUDIO PLAYBACK///////////
export interface Audio {
  id: number;
  name: string;
  pitch: number;
  reverb: number;
  distortion: number;
  feedback: number;
  delay: number;
  audio: File;
}


/////////MESSAGE PARSER///////////
export enum ParserState {
  COMMAND = 0,
  CODE_START = 1,
  CODE_END = 2
}


export const inlineStyles = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};
