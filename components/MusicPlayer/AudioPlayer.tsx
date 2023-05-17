import { FormatTimePlayer } from '@/utils/utils';
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useRef } from 'react';

type AudioPlayerProps = {
    file: File | ArrayBuffer;
    startTime: number;
    finishTime: number;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file, startTime, finishTime }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(startTime);

    const audioContext = useRef<AudioContext | null>(null);
    const audioSource = useRef<AudioBufferSourceNode | null>(null);
    const [timerID, setTimerID] = useState<NodeJS.Timeout | null>(null);


    const decode = async () => {
        audioContext.current = new AudioContext();
        audioSource.current = audioContext.current.createBufferSource();
        let audioData: ArrayBuffer

        if (file instanceof File) {
            audioData = await file.arrayBuffer();
        }
        else {
            audioData = file.slice(0)
        }


        audioContext.current.decodeAudioData(audioData, (buffer) => {
            if (audioSource.current) {
                audioSource.current.buffer = buffer;
                audioSource.current.connect(audioContext.current!.destination); // Connect to destination
                audioSource.current.start(0, currentTime, finishTime - currentTime);
                setIsPlaying(true);
            }
        });
    }

    const playAudio = async () => {
        await decode()
    };

    const pauseAudio = () => {
        if (audioSource.current) {
            audioSource.current.stop();
            audioSource.current.disconnect(audioContext.current!.destination); // Disconnect from destination
            setIsPlaying(false);
            audioSource.current = null;
        }
        if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
        }
    };


    const scrubAudio = (time: number) => {
        if (isPlaying) {
            pauseAudio();
        }
        // Clear the timer
        if (timerID) {
            clearInterval(timerID);
            setTimerID(null);
        }
        setCurrentTime(time);
    };


    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentTime(oldTime => {
                    if (oldTime >= finishTime) { // or some other condition
                        clearInterval(timer);
                        setCurrentTime(startTime)
                        setIsPlaying(false);
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
    }, [isPlaying, finishTime]); // or other dependencies

    useEffect(() => {
        if (!isPlaying && timerID) {
            clearInterval(timerID);
            setTimerID(null);
        }
    }, [isPlaying, timerID]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className='inline-flex items-center justify-between w-full p-2 bg-surface rounded-lg text-sm font-sans select-none'>

            <div className='bg-inverse-surface rounded-full w-full inline-flex items-center pl-4 py-4'>
                <button onClick={isPlaying ? pauseAudio : playAudio} className='pr-2' >
                    {
                        isPlaying ? (<span className="stop-icon text-surface"><PauseIcon height={'1rem'} width={'1rem'} /></span>) :
                            (<span className="play-icon text-surface"><PlayIcon height={'1rem'} width={'1rem'} /></span>)
                    }
                </button>
                <div>
                    <span className="current-time">
                        {FormatTimePlayer(currentTime)}
                    </span>{' '}
                    /{' '}
                    <span className="total-time">
                        {FormatTimePlayer(finishTime)}
                    </span>
                </div>
                <input
                    type="range"
                    min={startTime}
                    max={finishTime}
                    value={currentTime}
                    className="seek-bar"
                    onChange={(e) => scrubAudio(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;