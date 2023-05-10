import { BasicPitch } from '@spotify/basic-pitch';
import { noteFramesToTime, addPitchBendsToNoteEvents, outputToNotesPoly } from '@spotify/basic-pitch/dist/src/midi';
import { bufferToArrayBuffer } from './bufferToArrayBuffer';

export async function notesFromAudioFile(file: File): Promise<any> {
  const audioCtx = new AudioContext();
  const model = await BasicPitch.loadModel();
  const basicPitch = new BasicPitch(model);
  const arrayBuffer = await bufferToArrayBuffer(await file.arrayBuffer());
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  let frames: number[][] = [];
  let onsets: number[][] = [];
  let contours: number[][] = [];

  await basicPitch.evaluateModel(
    audioBuffer,
    (f: number[][], o: number[][], c: number[][]) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
  );

  const notes = noteFramesToTime(
    addPitchBendsToNoteEvents(
      contours,
      outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
    ),
  );

  return notes;
}
