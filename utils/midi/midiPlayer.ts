import { MIDIFile, MIDIEvents } from 'midi-file';
import 'webaudiofont';
const WebAudioFontPlayer = (window as any).WebAudioFontPlayer as new () => WebAudioFontPlayerInterface;

type LoadMidiOptions = {
  onProgress?: (progress: number) => void;
  onPlay: () => void;
  onStop?: () => void;
};

async function loadMidiFromBuffer(arrayBuffer: ArrayBuffer, options?: LoadMidiOptions): Promise<void> {
  const midiFile = new MIDIFile(arrayBuffer);
  const song = midiFile.parseSong();

  if (options?.onPlay) {
    initControlsForSong(song, options.onPlay, options.onStop);
 }
}

async function loadMidiFromFile(file: File, options?: LoadMidiOptions): Promise<void> {
  const midiFileReader = new FileReader();
  midiFileReader.onload = async (progressEvent: ProgressEvent<FileReader>) => {
    const arrayBuffer = progressEvent.target?.result as ArrayBuffer;
    await loadMidiFromBuffer(arrayBuffer, options);
  };
  midiFileReader.readAsArrayBuffer(file);
}

function setupHTMLInputElement(inputElement: HTMLInputElement) {
  inputElement.addEventListener('change', async (event: Event) => {
  [...]
};