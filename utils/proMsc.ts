import {
    NoteEventTime
} from "@/utils/basic_pitch/src";
import { Midi, Track } from "@tonejs/midi";
import { NoteJSON, Note } from "@tonejs/midi/dist/Note";

interface ModelNoteEvent {
    [key: string]: number;
    startFrame: number;
    durationFrames: number;
    pitchMidi: number;
    amplitude: number;
};

const keyMapping: { [key: string]: keyof ModelNoteEventShortened } = {
    startFrame: "s",
    durationFrames: "d",
    pitchMidi: "p",
    amplitude: "a",
};
interface ModelNoteEventShortened {
    s: number;
    d: number;
    p: number;
    a: number;
};

const filterAndAdjustNotesByTimeForModelAndStringifyNotes = (
    notes: NoteEventTime[],
    startTime: number,
    endTime: number,
    decimalPlaces: number = 3
): string => {
    // Filter and adjust notes
    const filteredAdjustedNotes = notes
        .filter(
            (note) =>
                note.startTimeSeconds >= startTime &&
                note.startTimeSeconds <= endTime
        )
        .map((note) => {
            const { pitchBends, ...filteredNote } = note; // Removes pitchBends property
            return {
                s: parseFloat(
                    (note.startTimeSeconds - startTime).toFixed(decimalPlaces)
                ),
                d: parseFloat(note.durationSeconds.toFixed(decimalPlaces)),
                p: note.pitchMidi,
                a: note.amplitude,
            };
        });

    // Stringify the resulting array
    return JSON.stringify(filteredAdjustedNotes);
};

const filterAndAdjustNotesByTimeForModel = (notes: NoteEventTime[], startTime: number, endTime: number, decimalPlaces: number = 3): NoteEventTime[] => {
    return notes
        .filter(note => note.startTimeSeconds >= startTime && note.startTimeSeconds <= endTime)
        .map(note => {
            const { pitchBends, ...filteredNote } = note; // Removes pitchBends property
            return {
                ...filteredNote,
                startTimeSeconds: parseFloat((note.startTimeSeconds - startTime).toFixed(decimalPlaces)),
                durationSeconds: parseFloat(note.durationSeconds.toFixed(decimalPlaces)),
            };
        });
};

function customStringifyForModel(notes: ModelNoteEvent[]) {
    return JSON.stringify(
        notes.map((note) => {
            const newNote: Partial<ModelNoteEventShortened> = {};
            for (const key in note) {
                newNote[keyMapping[key]] = note[key];
            }
            return newNote as ModelNoteEventShortened;
        })
    );
}

const noteSegmentation = (track: Track, splitMergeThreshold: number = 0.2) => {
    console.log(`splitMergeThreshold: ${splitMergeThreshold}`)
    track.notes = track.notes.reduce((outputNotes: Note[], note: Note) => {
        const lastNote = outputNotes[outputNotes.length - 1];

        const gap = lastNote && (note.time - (lastNote.time + lastNote.duration));

        // Merge Notes:
        if (lastNote && gap != null && gap < splitMergeThreshold && note.midi === lastNote.midi) {
            console.log(`Merge Notes: ${note.name} ${note.duration} ${note.time} ${lastNote.duration} ${lastNote.time}`)
            lastNote.duration += (note.duration + gap);
            return outputNotes;
        }

        // Split Notes:
        if (lastNote && note.duration > splitMergeThreshold) {
            console.log(`Splitting Note: ${note.name} ${note.duration} ${note.time} ${lastNote.duration} ${lastNote.time}`)
            // Split Note`)
            lastNote.duration = splitMergeThreshold;
            const remainingDuration = note.duration - splitMergeThreshold;

            outputNotes.push({
                ...note, duration: lastNote.duration,
                name: note.name,
                octave: note.octave,
                pitch: note.pitch,
                time: note.time,
                bars: note.bars,
                toJSON: function (): NoteJSON {
                    throw new Error("Function not implemented.");
                }
            })

            outputNotes.push({
                ...note, duration: remainingDuration,
                name: note.name,
                octave: note.octave,
                pitch: note.pitch,
                time: note.time + lastNote.duration,
                bars: note.bars,
                toJSON: function (): NoteJSON {
                    throw new Error("Function not implemented.");
                }
            })

            return outputNotes;
        }

        // No Split or Merge:
        outputNotes.push(note);

        return outputNotes;
    }, []);

    return track.notes
}

const pitchMinMax = (track: Track, minPitch: number = 21, maxPitch: number = 108) => {
    // minPitch, 21 -> A0 in MIDI
    //  maxPitch, 108 -> C8 in MIDI

    track.notes = track.notes.filter((note) => note.midi >= minPitch && note.midi <= maxPitch);
    return track.notes
}

const minDuration = (track: Track, minNoteLength: number = 0.02) => {
    track.notes = track.notes.filter((note) => note.duration >= minNoteLength);
    return track.notes
}

const tempo = (track: Track, current_midi: Midi) => {
    const desiredTempo = 80; // BPM

    const originalTempo = current_midi.header.tempos[0]?.bpm;
    if (!originalTempo) return track.notes
    const tempoRatio = originalTempo / desiredTempo;

    track.notes = track.notes.map((note) => (
        //   {
        //   ...note,
        //   time: note.time * tempoRatio,
        //   duration: note.duration * tempoRatio,
        // }
        {
            ...note, duration: note.duration * tempoRatio,
            name: note.name,
            octave: note.octave,
            pitch: note.pitch,
            time: note.time * tempoRatio,
            bars: note.bars,
            toJSON: function (): NoteJSON {
                throw new Error("Function not implemented.");
            }
        }
    ));
    return track.notes
}

const combineConsecutiveNotes = (track: Track, maxRepeats: number, maxInterval: number, midiThreshold: number): Note[] => {
    const newNotes: Note[] = [];

    let repeatCount = 0;
    let accumulation = 0;

    track.notes.forEach((note: Note, index: number) => {
        const prevNote = track.notes[index - 1];

        const isConsecutiveRepeatPredicate =
            prevNote &&
            Math.abs(note.midi - prevNote.midi) <= midiThreshold &&
            (note.time - prevNote.time) <= maxInterval;

        // prevNote && console.log(`Current: ${Math.abs(note.midi - prevNote.midi)} Threshold: ${midiThreshold}`)

        if (isConsecutiveRepeatPredicate) {
            console.log(`duplicate ad ${note.name} ${note.duration} ${note.time} ${prevNote.duration} ${prevNote.time}`)
            repeatCount++;
            accumulation += note.duration + (note.time - prevNote.time);

            if (repeatCount >= maxRepeats) {
                note.duration = accumulation
                // const newNote = createNoteWithNewDuration(note, accumulation);
                newNotes.push(note);
            }
        } else {
            if (repeatCount && newNotes[newNotes.length - 1].duration) {
                newNotes[newNotes.length - 1].duration = accumulation;
            }
            accumulation = 0;
            repeatCount = 0;
            newNotes.push(note);
        }
    });

    if (repeatCount && newNotes[newNotes.length - 1].duration) {
        newNotes[newNotes.length - 1].duration = accumulation;
    }

    return newNotes
}

const playNote = (n: {
    pitchMidi: number,
    amplitude: number,
    pitchBends: number[],
    startTimeSeconds: number,
    durationSeconds: number
}, audioContext: AudioContext) => {
    const startTime = audioContext.currentTime + n.startTimeSeconds;
    const frequency = Math.pow(2, (n.pitchMidi - 69) / 12) * 440;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(n.amplitude, startTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + n.durationSeconds);
    gainNode.connect(audioContext.destination);

    const osc = audioContext.createOscillator();
    osc.frequency.setValueAtTime(frequency, startTime);
    for (let i = 0; i < n.pitchBends.length; i++) {
        const time = startTime + (i * n.durationSeconds) / n.pitchBends.length;
        osc.frequency.exponentialRampToValueAtTime(frequency * n.pitchBends[i], time);
    }
    osc.connect(gainNode);

    osc.start(startTime);
    osc.stop(startTime + n.durationSeconds);
    console.log("GG")
}
const temp = () => {
    const audio = new AudioContext()
    playNote(midiNote, audio)
}

const midiNote = {
    "pitchMidi": 40,
    "amplitude": 0.6740055339676994,
    "pitchBends": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "startTimeSeconds": 0,
    "durationSeconds": 1
};

const filterNotesByTime = (notes: NoteEventTime[], startTime: number, endTime: number): NoteEventTime[] => {
    return notes.filter(note => note.startTimeSeconds >= startTime && note.startTimeSeconds <= endTime);
};

function groupNotesByMidi(trackNotes: Note[], noteThreshold: number): Note[][] {
    const groupedNotes: Note[][] = [];
    trackNotes.sort((a, b) => a.midi - b.midi);

    trackNotes.forEach((note) => {
        const foundGroupIndex = groupedNotes.findIndex(
            (group) => Math.abs(note.midi - group[0].midi) <= noteThreshold
        );

        if (foundGroupIndex > -1) {
            groupedNotes[foundGroupIndex].push(note);
        } else {
            groupedNotes.push([note]);
        }
    });

    return groupedNotes;
}

function combineConsecutiveNotesInSection(
    sectionNotes: Note[],
    maxRepeats: number,
    maxInterval: number): Note[] {
    const newNotes: Note[] = [];

    let repeatCount = 0;
    let accumulation = 0;

    sectionNotes.sort((a, b) => a.time - b.time).forEach((note, index) => {
        const prevNote = sectionNotes[index - 1];

        const isConsecutiveRepeatPredicate =
            prevNote &&
            (note.time - prevNote.time) <= maxInterval;

        if (isConsecutiveRepeatPredicate) {
            repeatCount++;
            accumulation += note.duration + (note.time - prevNote.time);

            if (repeatCount >= maxRepeats) {
                note.duration = accumulation
                // const combinedNote = createNoteWithNewDuration(note, accumulation);
                newNotes.push(note);
                repeatCount = 0;
                accumulation = 0;
            }
        } else {
            if (repeatCount > 0 && newNotes.length) {
                newNotes[newNotes.length - 1].duration = accumulation;
            }

            repeatCount = 0;
            accumulation = 0;

            newNotes.push(note);
        }
    });

    if (repeatCount > 0) {
        newNotes[newNotes.length - 1].duration = accumulation;
    }

    return newNotes;
}

function combineSimilarMidiTrackNotes(track: Track, maxRepeats: number, maxInterval: number, midiThreshold: number): Note[] {
    const notesBySections = groupNotesByMidi(track.notes, midiThreshold);
    console.log(notesBySections)
    const updatedSections = notesBySections.map(
        (sectionNotes) => combineConsecutiveNotesInSection(sectionNotes, maxRepeats, maxInterval),
    );
    console.log(updatedSections)
    return ([] as Note[]).concat(...updatedSections);
};

// function onPlayToggle() {
//     const textarea = textareaRef.current;
//     const playToggle = playToggleRef.current;

//     const playing = playToggle?.getAttribute("data-playing") === "true";
//     playToggle?.setAttribute("data-playing", (!playing).toString());


//     if (!playing && currentMidi) {
//         const now = ToneNow() + 0.5;
//         currentMidi.tracks.forEach((track) => {
//             const synth = new PolySynth(Synth, {
//                 envelope: {
//                     attack: 0.02,
//                     decay: 0.1,
//                     sustain: 0.3,
//                     release: 1,
//                 },
//             })
//             synth.maxPolyphony = 64

//             // sanitization
//             // console.log("called segmentation")
//             // console.log(track.notes.length)
//             // track.notes = noteSegmentation(track, 2);
//             // console.log(track.notes.length)

//             // track.notes = pitchMinMax(track, 21, 108);
//             // console.log(track.notes.length)

//             // track.notes = minDuration(track, 0.02);
//             // console.log(track.notes.length)

//             // track.notes = tempo(track, currentMidi);

//             console.log(track.notes.length)
//             // track.notes = combineConsecutiveNotes(track, 2, 0.1, 3);
//             track.notes = combineSimilarMidiTrackNotes(track, 2, 0.15, 3);
//             console.log(track.notes.length)


//             // .toDestination();
//             // Create a new PitchShift effect
//             const pitchBend = new PitchShift();

//             // Connect the synth to the pitchBend effect and then to the destination
//             synth.connect(pitchBend);
//             pitchBend.toDestination();

//             setSynths((prevSynths) => [...prevSynths, synth]);

//             // track.notes.forEach(({ name, duration, time, velocity }) => {
//             //   synth.triggerAttackRelease(name, duration, time + now, velocity);
//             // });
//             track.notes.forEach(({ name, duration, time, velocity }, index) => {
//                 // Get the corresponding pitchBend event by index, if any
//                 const event = track.pitchBends[index];

//                 if (event) {
//                     // Shift the pitch by the requested amount in semitones (cents / 100)
//                     pitchBend.pitch = event.value * 100;
//                 }

//                 synth.triggerAttackRelease(name, duration, time + now, velocity);
//             });


//         });
//     } else {
//         for (const synth of synths) {
//             synth.disconnect();
//         }
//         setSynths([]);
//     }
// }

const formatAndStringifyNotesForModel = (
    notes: NoteEventTime[],
    decimalPlaces: number = 3
): string => {
    // Map notes to the new format without adjusting time or filtering
    const mappedNotes = notes.map((note) => {
        const { pitchBends, ...filteredNote } = note; // Removes pitchBends property
        return {
            s: parseFloat(note.startTimeSeconds.toFixed(1)),
            d: parseFloat(note.durationSeconds.toFixed(decimalPlaces)),
            p: note.pitchMidi,
            a: parseFloat(note.amplitude.toFixed(decimalPlaces)),
        };
    });

    // Stringify the resulting array
    const jsonString = JSON.stringify(mappedNotes);
    const reducedString = jsonString
        .replace(/[{",]/g, "")
        .replace(/}/g, ",");
    return reducedString;
};

// function parseFile(buffer: Buffer) {
//     const arrayBuffer = new Uint8Array(buffer).buffer; // the buffer is already a unint8array
//     const midi = new Midi(arrayBuffer);
//     setCurrentMidi(midi);
// }


// BETA
const extractChords = (essentiaInstance: any, monoSignal: any, sampleRate: number): any => {
    // const monoSignal = essentiaInstance.vectorToArray(monoAudio)

    let vectorVectorFloat = new essentiaInstance.module.VectorVectorFloat()

    let frames = essentiaInstance.FrameGenerator(monoSignal, 22050, 11025)
    let numFrames = frames.size();
    for (let i = 0; i < 10; i++) {
        let frame = frames.get(i);
        let frame_spectrum = essentiaInstance.Spectrum(frame).spectrum;
        let { frequencies, magnitudes } = essentiaInstance.SpectralPeaks(frame_spectrum);
        let hpcp_output = essentiaInstance.HPCP(frequencies, magnitudes).hpcp;

        vectorVectorFloat.push_back(hpcp_output)
    }

    const chordsDetection = essentiaInstance.ChordsDetection(vectorVectorFloat, 22050, sampleRate, 2)

    return { chords: essentiaInstance.vectorToArray(chordsDetection.chords), strength: essentiaInstance.vectorToArray(chordsDetection.strength) }


    // NOT WORKING //
    // const multiPitchmelody = await essentiaInstance.MultiPitchMelodia(monoAudio, 10, 3, 8192, false, 0.8, 4096, 1, 40, 20000, 100, 40, 20, 0.9, 0.9, 27.5625, 55, 44100, 100);
    // console.log(multiPitchmelody)
    // console.log(essentiaInstance.vectorToArray(multiPitchmelody.pitch))

    // A typed array of 32-bit float values. The contents are initialized to 0. If the requested number of bytes could not be allocated an exception is raised.
    // const tonal = essentiaInstance.TonalExtractor(monoAudio.audio)
    // const multiPitchmelody = await essentiaInstance.MultiPitchMelodia(monoAudio.audio)

    // const loudness = essentiaInstance.LoudnessEBUR128(left, right, 0.1, originalBuffer.sampleRate)
    // const predominantPitchmelody = await essentiaInstance.PredominantPitchMelodia(monoAudio.audio)
}