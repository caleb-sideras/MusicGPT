import React, { useState, useEffect, useRef } from 'react';
import * as mm from '@magenta/music';
import { NoteSequence, INoteSequence } from '@magenta/music';
import Visualizer from './ReactVisualizer';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons'
import Waveform from '../Icons/waveform';
import { FormatTimePlayer } from '@/utils/utils';

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
  const [timerID, setTimerID] = useState<NodeJS.Timeout | null>(null);

  const playButtonRef = useRef<HTMLButtonElement>(null);
  const seekBarRef = useRef<HTMLInputElement>(null);
  const currentTimeLabelRef = useRef<HTMLSpanElement>(null);
  const totalTimeLabelRef = useRef<HTMLSpanElement>(null);
  const visualizerRef = useRef<VisualizerHandle>(null);


  useEffect(() => {
    if (src) {
      initPlayer();
    }
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (buffer) {
      initPlayer();
    }
  }, [buffer]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (noteSequence) {
      initPlayer();
    }
  }, [noteSequence]); // eslint-disable-line react-hooks/exhaustive-deps

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
      setDuration(Math.round(ns.totalTime as number));

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

  useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setCurrentTime(oldTime => {
          if (oldTime + 1 >= duration) { // or some other condition
            clearInterval(timer);
            console.log(oldTime, Math.round(duration))
            setCurrentTime(0)
            return oldTime;
          }
          return oldTime + 1;
        });
      }, 1000);
      setTimerID(timer);
    }
    return () => {
      if (timerID) {
        clearInterval(timerID);
      }
    }
  }, [playing, duration]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (timerID) {
      clearInterval(timerID);
      setTimerID(null);
    }
  };

  useEffect(() => {
    if (!playing && timerID) {
      clearInterval(timerID);
      setTimerID(null);
    }
  }, [playing, timerID]);

  const handleSeekBarInput = () => {
    setSeeking(true);
    if (player && player.isPlaying()) {
      player.pause();
    }
  };

  const handleSeekBarChange = () => {
    if (!player) return;
    if (seekBarRef.current) {
      const time = parseFloat(seekBarRef.current.value);
      setCurrentTime(time);
      if (player.isPlaying()) {
        player.seekTo(time);
        if (player.getPlayState() === 'paused') {
          player.resume();
        }
      }
      setSeeking(false);
    }

    // More efficient way to do this
    // currentTimeLabelRef.current.textContent = formatTime(time);
    // seekBarRef.current.value = time; 

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
      {!nSequence ?
        <div className='w-full justify-center flex'>
          <Waveform height={40} width={75} />
        </div> :
        <>
          <div className={`inline-flex items-center justify-between w-full p-2 bg-inverse-surface rounded-lg text-sm font-sans select-none ${playing ? 'playing' : 'stopped'} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}>
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
                {FormatTimePlayer(currentTime)}
              </span>{' '}
              /{' '}
              <span className="total-time" ref={totalTimeLabelRef}>
                {FormatTimePlayer(duration)}
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
              noteSequence={nSequence as INoteSequence}
              type="piano-roll"
              ref={visualizerRef}
              config={visualizerConfig}
            />
          }
        </>
      }


    </div>
  );
};

export default PlayerElement;