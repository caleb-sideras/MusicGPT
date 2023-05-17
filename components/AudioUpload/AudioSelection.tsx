import React, { useEffect, useState } from 'react'
import SwitchDemo from '../Tools/Switch'
import { FileIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import {
    BasicPitch, addPitchBendsToNoteEvents,
    noteFramesToTime,
    outputToNotesPoly,
    generateFileData,
    NoteEventTime,
} from "@/utils/basic-pitch-ts/src";
import * as tf from '@tensorflow/tfjs';
import { FileProps, LoadingState, LoaderType, ProState, ProdTypes } from "@/types";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import SmallLoader from '../Loaders/SmallLoader';

import Essentia from '@/utils/essentia/core_api'
import EssentiaWASM from '@/utils/essentia/dist/essentia-wasm.web'
import { roundTo } from '@/utils/utils';
import ErrorComponent from '../Loaders/Error';


type AudioSelectionProps = {
    fileProps: FileProps
    setSongMidi: React.Dispatch<React.SetStateAction<NoteEventTime[]>>;
    setFileData: React.Dispatch<React.SetStateAction<Buffer>>;
    setParentState: React.Dispatch<React.SetStateAction<ProState>>;
    setProdData: React.Dispatch<React.SetStateAction<ProdTypes>>;
}

enum AudioExtractionLoadingStates {
    IDLE = 0,
    PRE_MODEL = 1,
    MODEL = 2,
    PROD = 3,
    WEB_DATA = 4,
    LYRICS = 5,
    CAAS = 6
}

interface ProdReturnType extends ProdTypes {
    status: string
}

function AudioSelection({ fileProps, setSongMidi, setFileData, setParentState, setProdData }: AudioSelectionProps) {
    const [loadingState, setLoadingState] = useState<AudioExtractionLoadingStates>(AudioExtractionLoadingStates.IDLE)

    const [isError, setIsError] = useState<boolean>(false)

    const [midi, setMidi] = useState<boolean>(true)
    const [midiState, setMidiState] = useState<LoadingState>(LoadingState.loading)
    const [pct, setPct] = useState<number>(0);

    const [prod, setProd] = useState<boolean>(true)
    const [prodState, setprodState] = useState<LoadingState>(LoadingState.loading)

    const [ws, setWS] = useState<boolean>(false)
    const [wsState, setWSState] = useState<LoadingState>(LoadingState.loading)

    const [lyrics, setLyrics] = useState<boolean>(false)
    const [lyricsState, setLyricsState] = useState<LoadingState>(LoadingState.loading)

    const [caas, setCAAS] = useState<boolean>(false)
    const [caasState, setCAASState] = useState<LoadingState>(LoadingState.loading)

    useEffect(() => {
        // console.log(pct)
    }, [pct])

    const handleExtraction = async () => {
        setParentState(ProState.loading);

        const audioContext = new AudioContext();
        const audioData = await fileProps.file.arrayBuffer();
        const originalBuffer = await audioContext.decodeAudioData(audioData);

        if (midi) {
            const evals = await handleConvertToMidi(originalBuffer)
            if (evals?.status == 'success') {
                const { midi, fileData } = callModel(evals.frames as number[][], evals.onsets as number[][], evals.contours as number[][])
                setSongMidi(midi)
                setFileData(fileData)
            }
            else{
                setParentState(ProState.convert);
                setIsError(true)
            }
        }
        if (prod) {
            const { status, panningScore, dynamicComplexity, dynamicComplexityLoudness, loudness }: ProdReturnType = await handleProduction(originalBuffer)
            if (status == 'success') {
                setProdData({ panningScore, dynamicComplexity, dynamicComplexityLoudness, loudness })
                // console.log({ panningScore, dynamicComplexity, dynamicComplexityLoudness, loudness })
            }
            else{
                setParentState(ProState.convert);
                setIsError(true)
            }
        }
        setParentState(ProState.instructions)
    }

    const handleConvertToMidi = async (originalBuffer: AudioBuffer, resamplingRate = 22050) => {

        if (!fileProps) return;
        setLoadingState(AudioExtractionLoadingStates.PRE_MODEL)

        try {
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
                originalBuffer = await offlineCtx.startRendering();
            }

            const basicPitch = new BasicPitch(
                tf.loadGraphModel('/model.json'),
            );
            // await basicPitch.evaluateModel(
            //     originalBuffer,
            //     (f: number[][], o: number[][], c: number[][]) => {
            //         setFrames((prevFrames) => [...prevFrames, ...f]);
            //         setOnsets((prevOnsets) => [...prevOnsets, ...o]);
            //         setContours((prevContours) => [...prevContours, ...c]);
            //     },
            //     (p: number) => {
            //         setPct(p * 100);
            //     }
            // );

            let frames: number[][] = []
            let onsets: number[][] = []
            let contours: number[][] = []

            await basicPitch.evaluateModel(
                originalBuffer,
                (f: number[][], o: number[][], c: number[][]) => {
                    frames = [...frames, ...f];
                    onsets = [...onsets, ...o];
                    contours = [...contours, ...c];
                },
                (p: number) => {
                    setPct(p * 100);
                }
            );
            return { status: 'success', frames: frames, onsets: onsets, contours: contours }

        } catch (error) {
            // console.log(error)
            return { status: 'error' }
        }
    };

    // model should run in a web worker
    const callModel = (frames: number[][], onsets: number[][], contours: number[][]) => {
        setLoadingState(AudioExtractionLoadingStates.MODEL)

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
        // console.log("Model finished")

        return { midi: midi, fileData: generateFileData(midi) }
    }

    const handleProduction = async (originalBuffer: AudioBuffer) => {

        const computePanningCoefficient = async (leftChannel: any, rightChannel: any, essentia: any) => {
            /**
             * The computePanningCoefficient function calculates the panning coefficient for stereo audio, reflecting the relative energy balance between the left and right channels. The coefficient (-1 to 1) indicates the stereo image's direction: -1 for full left, 1 for full right, and 0 for centered.
             */
            let leftEnergy = await essentia.Energy(leftChannel).energy;
            let rightEnergy = await essentia.Energy(rightChannel).energy;

            let panning = (rightEnergy - leftEnergy) / (rightEnergy + leftEnergy);

            return panning;
        }

        setLoadingState(AudioExtractionLoadingStates.PROD)

        try {
            const essentiaInstance = await Essentia.init(EssentiaWASM, true);
            const left = await essentiaInstance.arrayToVector(originalBuffer.getChannelData(0));
            const right = await essentiaInstance.arrayToVector(originalBuffer.getChannelData(1));
            const monoAudio = await essentiaInstance.MonoMixer(left, right).audio

            // Stero Image //
            const panningScore = await computePanningCoefficient(left, right, essentiaInstance)

            // Compression //
            const dynamicComplexity = await essentiaInstance.DynamicComplexity(monoAudio, 0.2, originalBuffer.sampleRate)
            const loudness = await essentiaInstance.Loudness(monoAudio)


            return { status: 'success', panningScore: roundTo(panningScore, 3), dynamicComplexity: roundTo(dynamicComplexity.dynamicComplexity, 3), dynamicComplexityLoudness: roundTo(dynamicComplexity.loudness, 3), loudness: roundTo(loudness.loudness, 3) }

        } catch (error) {
            // console.log(error)
            return { status: 'error', panningScore: 0, dynamicComplexity: 0, dynamicComplexityLoudness: 0, loudness: 0 }

        }
    }

    return (
        <div className='flex flex-col gap-4 w-full px-4 py-8'>
            { isError && <ErrorComponent message={'An error occured...'}/>}
            {loadingState === AudioExtractionLoadingStates.IDLE ?
                <div className='grid sm:grid-cols-2 grid-cols-1 '>
                    <div className='grid col-span-1 gap-4'>
                        <div className='flex flex-row justify-between'>
                            <div className='text-md text-on-surface flex flex-row'>
                                <div>MIDI</div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                                            aria-label="Customise options"
                                        >
                                            <InfoCircledIcon
                                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                                aria-hidden
                                            />
                                        </button>
                                    </DropdownMenu.Trigger>
                                    {/* Polyphonic MIDI extraction using a ~17k parameter Neural Network */}
                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-40 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            sideOffset={5}
                                        >
                                            The songs notes, harmonies and various melodic tracks
                                            <DropdownMenu.Arrow className="fill-white" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                            <SwitchDemo isChecked={false} setIsChecked={setMidi} defaultChecked={true} disabled={true} />
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='text-md text-on-surface flex flex-row'>
                                <div>Production</div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                                            aria-label="Customise options"
                                        >
                                            <InfoCircledIcon
                                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                                aria-hidden
                                            />
                                        </button>
                                    </DropdownMenu.Trigger>
                                    {/* Waveform analysis to help understand stero image, compression etc. */}

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-40 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            sideOffset={5}
                                        >
                                            Technical aspects of audio production and engineering - stero image, compression etc
                                            <DropdownMenu.Arrow className="fill-white" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                            <SwitchDemo isChecked={false} setIsChecked={setProd} defaultChecked={true} disabled={false} />
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='text-md items-center text-on-surface flex flex-row'>
                                <div>Web Data</div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                                            aria-label="Customise options"
                                        >
                                            <InfoCircledIcon
                                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                                aria-hidden
                                            />
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-40 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            sideOffset={5}
                                        >
                                            Any publicly available data about the song
                                            <DropdownMenu.Arrow className="fill-white" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                                <div className='text-sm text-on-surface'>
                                    Coming soon...
                                </div>
                            </div>
                            <SwitchDemo isChecked={false} setIsChecked={setWS} defaultChecked={false} disabled={true} />
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='text-md items-center text-on-surface flex flex-row'>
                                <div>Lyrics</div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                                            aria-label="Customise options"
                                        >
                                            <InfoCircledIcon
                                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                                aria-hidden
                                            />
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-40 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            sideOffset={5}
                                        >
                                            Understand the meaning and relevance of the lyrics in 99 languages
                                            <DropdownMenu.Arrow className="fill-white" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                                <div className='text-sm text-on-surface'>
                                    Coming soon...
                                </div>
                            </div>
                            <SwitchDemo isChecked={false} setIsChecked={setLyrics} defaultChecked={false} disabled={true} />
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='text-md items-center text-on-surface flex flex-row'>
                                <div>CAAS*</div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button
                                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                                            aria-label="Customise options"
                                        >
                                            <InfoCircledIcon
                                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                                aria-hidden
                                            />
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="w-52 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            sideOffset={5}
                                        >
                                            Clustering Audio Adaptive Segmentation (CAAS) algorithm designed to help MusicGPT better understand distinct musical features. *Beta
                                            <DropdownMenu.Arrow className="fill-white" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                                <div className='text-sm text-on-surface'>
                                    Coming soon...
                                </div>
                            </div>
                            <SwitchDemo isChecked={false} setIsChecked={setCAAS} defaultChecked={false} disabled={true} />
                        </div>
                    </div>
                    <div className='grid col-span-1 justify-center items-end'>
                        <FileIcon className='w-full h-16 text-on-surface' />
                        <div className="text-center text-lg text-on-surface mb-4">
                            {fileProps?.name}
                        </div>
                        <button className="mx-auto transition w-36 bg-success hover:bg-on-success text-on-success hover:text-success p-4 rounded-full" onClick={handleExtraction}>
                            Start
                        </button>
                    </div>
                </div>
                : loadingState !== AudioExtractionLoadingStates.MODEL ?
                    <SmallLoader height={0} width={0} waveformColor={''} textColor={'surface'} bgColor={'on-surface'}
                        contents={[
                            {
                                text: '',
                                loadingState: LoadingState.loading,
                                loaderType: LoaderType.progress,
                                progress: pct
                            }
                        ]}
                    />
                    : <></>
            }
        </div>


    )
}

export default AudioSelection