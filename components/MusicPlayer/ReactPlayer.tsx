import React, { useState, useEffect, useRef } from 'react';
import * as mm from '@magenta/music';
import { NoteSequence, INoteSequence } from '@magenta/music';
import Visualizer from './ReactVisualizer';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons'

const DEFAULT_SOUNDFONT = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus';

type PlayerProps = {
  src?: string;
  buffer?: Buffer;
  soundFont?: string | null;
  noteSequence?: INoteSequence;
  loop?: boolean;
  visualizerRef?: React.RefObject<VisualizerHandle>;
  visualizer?: boolean
};

export interface VisualizerHandle {
  redraw: (activeNote?: NoteSequence.INote) => void;
  clearActiveNotes: () => void;
  reload: () => void;
}

const visualizerConfig = {
  noteHeight: 3,
  noteSpacing: 2,
  pixelsPerTimeStep: 20,
  noteRGB: '225, 227, 227',
  // activeNoteRGB: '177, 203, 208',
} as mm.VisualizerConfig;


const PlayerElement: React.FC<PlayerProps> = ({
  src,
  buffer,
  soundFont,
  noteSequence,
  loop = false,
  visualizer = true
  // visualizerRef,
}) => {
  const [player, setPlayer] = useState<mm.BasePlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nSequence, setNSequence] = useState<INoteSequence | null>(null);

  const playButtonRef = useRef<HTMLButtonElement>(null);
  const seekBarRef = useRef<HTMLInputElement>(null);
  const currentTimeLabelRef = useRef<HTMLSpanElement>(null);
  const totalTimeLabelRef = useRef<HTMLSpanElement>(null);
  const visualizerRef = useRef<VisualizerHandle>(null);

  useEffect(() => {
    if (src) {
      initPlayer();
    }
  }, [src]);

  useEffect(() => {
    if (buffer) {
      initPlayer();
    }
  }, [buffer]);

  useEffect(() => {
    if (noteSequence) {
      initPlayer();
    }
  }, [noteSequence]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const setLoadingState = () => {
    setLoading(true);
    setError(null);
  };

  const setLoadedState = () => {
    setLoading(false);
    setError(null);
  };

  const setErrorState = (error: string) => {
    setLoading(false);
    setError(error);
  };

  const bufferToNoteSequenceUsingBlob = async (buffer: Buffer): Promise<NoteSequence> => {
    const blob = new Blob([buffer], { type: 'audio/midi' });
    return mm.blobToNoteSequence(blob);
  };

  const initPlayer = async () => {
    setLoadingState();
    try {
      let ns: INoteSequence | null = noteSequence || null;
      if (src) {
        ns = await mm.urlToNoteSequence(src);
      }
      if (buffer) {
        ns = await bufferToNoteSequenceUsingBlob(buffer);
      }
      setNSequence(ns);

      if (!ns) {
        setErrorState('No content loaded');
        return;
      }

      setCurrentTime(0);
      setDuration(ns.totalTime as number);

      let newPlayer: mm.BasePlayer;
      const callbackObject = {
        run: (note: NoteSequence.INote) => {
          if (visualizerRef?.current) {
            visualizerRef.current.redraw(note);
          }
        },
        stop: () => { },
      };
      if (soundFont === null) {
        newPlayer = new mm.Player(false, callbackObject);
      } else {
        if (soundFont === '') {
          soundFont = DEFAULT_SOUNDFONT;
        }
        newPlayer = new mm.SoundFontPlayer(soundFont as string, undefined, undefined, undefined, callbackObject);
        await (newPlayer as mm.SoundFontPlayer).loadSamples(ns);
      }
      setPlayer(newPlayer);
      setLoadedState();
    } catch (error) {
      setErrorState(String(error));
      throw error;
    }
  };

  const start = async () => {
    if (!player) return;
    setPlaying(true);
    await player.start(nSequence as INoteSequence, undefined, currentTime);
    setPlaying(false);
  };

  const stop = () => {
    if (!player) return;
    player.stop();
    setPlaying(false);
  };

  const handleSeekBarInput = () => {
    setSeeking(true);
    if (player && player.isPlaying()) {
      player.pause();
    }
  };

  const handleSeekBarChange = () => {
    if (!player) return;
    const time = parseFloat(seekBarRef.current.value);
    setCurrentTime(time);
    // More efficient way to do this
    // currentTimeLabelRef.current.textContent = formatTime(time);
    // seekBarRef.current.value = time; 
    if (player.isPlaying()) {
      player.seekTo(time);
      if (player.getPlayState() === 'paused') {
        player.resume();
      }
    }
    setSeeking(false);
  };

  const handlePlayButtonClick = () => {
    if (!player) return;
    if (player.isPlaying()) {
      stop();
    } else {
      start();
    }
  };

  return (
    <div className='flex flex-col bg-surface rounded-lg p-4 overflow-x-hidden w-full'>
      <div className={`inline-flex items-center justify-between w-full p-2 bg-inverse-surface rounded-full text-sm font-sans select-none ${playing ? 'playing' : 'stopped'} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}>
        <button
          className="play"
          disabled={loading || error !== null}
          onClick={handlePlayButtonClick}
          ref={playButtonRef}
        >
          {
            playing ? (<span className="stop-icon text-surface"><PauseIcon height={'1rem'} width={'1rem'} /></span>) :
              (<span className="play-icon text-surface"><PlayIcon height={'1rem'} width={'1rem'} /></span>)
          }
        </button>
        <div>
          <span className="current-time" ref={currentTimeLabelRef}>
            {formatTime(currentTime)}
          </span>{' '}
          /{' '}
          <span className="total-time" ref={totalTimeLabelRef}>
            {formatTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          step="any"
          className="seek-bar"
          disabled={loading || error !== null}
          onInput={handleSeekBarInput}
          onChange={handleSeekBarChange}
          ref={seekBarRef}

        />
      </div>
      {nSequence && visualizer &&
        <Visualizer
          // src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/jazz.mid"
          noteSequence={nSequence as INoteSequence}
          type="piano-roll"
          ref={visualizerRef}
          config={visualizerConfig}
        />
      }

    </div>
  );
};

export default PlayerElement;