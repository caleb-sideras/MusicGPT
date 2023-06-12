import React, { useState } from 'react'
import { FileIcon } from '@radix-ui/react-icons'
import {
    BasicPitch, addPitchBendsToNoteEvents,
    noteFramesToTime,
    outputToNotesPoly,
    generateFileData,
} from "@/utils/basic-pitch-ts/src";
import * as tf from '@tensorflow/tfjs';
import { LoadingState, LoaderType, ProState, ChatData, ProdProps } from "@/types";
import SmallLoader from '../Loaders/SmallLoader';
import FeatureSelection, { FeatureSelectionProps } from '../Features/FeatureSelection'

import Essentia from '@/utils/essentia/core_api'
import EssentiaWASM from '@/utils/essentia/dist/essentia-wasm.web'
import { roundTo } from '@/utils/utils';
import ErrorComponent from '../Loaders/Error';
import EssentiaExtractor from '@/utils/essentia/extractor/extractor';

type AudioSelectionProps = {
    setParentState: React.Dispatch<React.SetStateAction<ProState>>;
    setChatData: React.Dispatch<React.SetStateAction<ChatData>>;
    chatData: ChatData
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

interface ProdReturnType extends ProdProps {
    status: string
}

function AudioSelection({ setParentState, setChatData, chatData }: AudioSelectionProps) {
    const [loadingState, setLoadingState] = useState<AudioExtractionLoadingStates>(AudioExtractionLoadingStates.IDLE)

    const [isError, setIsError] = useState<boolean>(false)
    const [pct, setPct] = useState<number>(0);

    const [midi, setMidi] = useState<boolean>(true)
    const [prod, setProd] = useState<boolean>(true)
    const [graph, setGraph] = useState<boolean>(true)
    const [ws, setWS] = useState<boolean>(false)
    const [lyrics, setLyrics] = useState<boolean>(false)
    const [caas, setCAAS] = useState<boolean>(false)

    const FeatureSelections: FeatureSelectionProps[] = [
        {
            title: 'MIDI',
            body: 'The songs notes, harmonies and various melodic tracks',
            defaultChecked: true,
            disabled: false,
            setIsChecked: setMidi
        },
        {
            title: 'Production',
            body: 'Technical aspects of audio production and engineering - stero image, compression etc',
            defaultChecked: true,
            disabled: false,
            setIsChecked: setProd
        },
        {
            title: 'Graphs',
            body: 'Graphs visualizations and code interpreter',
            defaultChecked: true,
            disabled: false,
            setIsChecked: setGraph
        },
        {
            title: 'Web Data',
            body: 'Any publicly available data about the song',
            defaultChecked: false,
            disabled: true,
            setIsChecked: setWS
        },
        {
            title: 'Lyrics',
            body: 'Understand the meaning and relevance of the lyrics in 99 languages',
            defaultChecked: false,
            disabled: true,
            setIsChecked: setLyrics
        },
        {
            title: 'CAAS',
            body: 'Clustering Audio Adaptive Segmentation (CAAS) algorithm designed to help MusicGPT better understand distinct musical features. *Beta',
            defaultChecked: false,
            disabled: true,
            setIsChecked: setCAAS
        },
    ]

    const handleExtraction = async () => {
        setParentState(ProState.loading);

        const audioContext = new AudioContext();
        const audioData = await chatData.file.file.arrayBuffer();
        const originalBuffer = await audioContext.decodeAudioData(audioData);

        let chatDataUpdates: any = {};

        if (midi) {
            const evals = await handleConvertToMidi(originalBuffer)
            if (evals?.status == 'success') {
                const { midiData, fileData } = callModel(evals.frames as number[][], evals.onsets as number[][], evals.contours as number[][])
                chatDataUpdates = { ...chatDataUpdates, midi: midiData };
            }
            else {
                setParentState(ProState.convert);
                setIsError(true)
            }
        }
        if (prod) {
            const { status, panningScore, dynamicComplexity, dynamicComplexityLoudness, loudness }: ProdReturnType = await handleProduction(originalBuffer)
            if (status == 'success') {
                chatDataUpdates = { ...chatDataUpdates, prod: { panningScore, dynamicComplexity, dynamicComplexityLoudness, loudness } };
            }
            else {
                setParentState(ProState.convert);
                setIsError(true)
            }
        }
        if (graph) {
            const { status, audioFrame } = await handleGraphs(originalBuffer)
            if (status == 'success') {
                chatDataUpdates = {
                    ...chatDataUpdates,
                    graph: {
                        frame: audioFrame as Float32Array,
                        length: audioFrame?.length as number,
                        sampleRate: originalBuffer.sampleRate,
                        duration: originalBuffer.duration
                    }
                };
            }
            else {
                setParentState(ProState.convert);
                setIsError(true)
            }
        }

        // console.log(chatDataUpdates)
        setChatData({ ...chatData, ...chatDataUpdates });
        setParentState(ProState.instructions)
    }

    const handleConvertToMidi = async (originalBuffer: AudioBuffer, resamplingRate = 22050) => {

        if (!chatData.file) return;
        setLoadingState(AudioExtractionLoadingStates.PRE_MODEL)

        // double computation with stereo to mono - needs fix
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

            // const model = await tf.loadGraphModel('/model.json')
            const response = await fetch('/model.json');
            const json = await response.json();
            console.log("JSON: ", json)
            const basicPitch = new BasicPitch(json);
            console.log("basicPitch: ", basicPitch)


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
            return { status: 'error' }
        }
    };

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
            return { status: 'error', panningScore: 0, dynamicComplexity: 0, dynamicComplexityLoudness: 0, loudness: 0 }

        }
    }

    const handleGraphs = async (originalBuffer: AudioBuffer) => {
        try {
            const essentiaInstance = await Essentia.init(EssentiaWASM, true)
            const audioFrame = essentiaInstance.audioBufferToMonoSignal(originalBuffer)

            return { status: 'success', audioFrame }
        } catch (error) {
            return { status: 'error' }
        }
    }

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

        return { midiData: midi, fileData: generateFileData(midi) }
    }

    return (
        <div className='flex flex-col gap-4 w-full px-4 py-8'>
            {isError && <ErrorComponent message={'An error occured...'} />}
            {loadingState === AudioExtractionLoadingStates.IDLE ?
                <div className='grid sm:grid-cols-2 grid-cols-1 '>
                    <div className='grid col-span-1 gap-4'>
                        {
                            FeatureSelections.map((value, index) => (
                                <FeatureSelection {...value} key={index} />
                            ))
                        }
                    </div>
                    <div className='grid col-span-1 justify-center items-end'>
                        <FileIcon className='w-full h-16 text-on-surface' />
                        <div className="text-center text-lg text-on-surface mb-4">
                            {chatData.file?.name}
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