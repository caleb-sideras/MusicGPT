import { Message, MessagePro } from "@/types";
import { NoteEventTime } from "./basic-pitch-ts/src";

export function formatTime(seconds: number) {
  const negative = (seconds < 0);
  seconds = Math.floor(Math.abs(seconds || 0));
  const s = seconds % 60;
  const m = (seconds - s) / 60;
  const h = (seconds - s - 60 * m) / 3600;
  const sStr = (s > 9) ? `${s}` : `0${s}`;
  const mStr = (m > 9 || !h) ? `${m}:` : `0${m}:`;
  const hStr = h ? `${h}:` : '';
  return (negative ? '-' : '') + hStr + mStr + sStr;
}

export const FormatTimePlayer = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function roundTo(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

export const filterAndAdjustNotesByTime = (notes: NoteEventTime[], startTime: number, endTime: number): NoteEventTime[] => {
  return notes
    .filter(note => note.startTimeSeconds >= startTime && note.startTimeSeconds <= endTime)
    .map(note => ({
      ...note,
      startTimeSeconds: note.startTimeSeconds - startTime,
    }));
};

export const formatCategorizeStringifyNotesForModel = (
  notes: NoteEventTime[],
  decimalPlaces: number = 3
): string => {
  // Initialize the categorizedNotes object
  const categorizedNotes: { [key: string]: any[] } = {
    "Bass": [],
    "Mid-range": [],
    "High-range": [],
    "Uncategorized": [],
  };

  // Map notes to the new format, categorize, and add them to the categorizedNotes object
  notes.forEach((note) => {
    const { pitchBends, ...filteredNote } = note; // Removes pitchBends property
    const formattedNote = {
      s: parseFloat(note.startTimeSeconds.toFixed(1)),
      d: parseFloat(note.durationSeconds.toFixed(decimalPlaces)),
      p: note.pitchMidi,
      a: parseFloat(note.amplitude.toFixed(decimalPlaces)),
    };

    let category: string;

    if (formattedNote.p >= 24 && formattedNote.p <= 48) {
      category = "Bass";
    } else if (formattedNote.p >= 49 && formattedNote.p <= 72) {
      category = "Mid-range";
    } else if (formattedNote.p >= 73 && formattedNote.p <= 96) {
      category = "High-range";
    } else {
      category = "Uncategorized";
    }
    // Stringify the resulting array
    const jsonString = JSON.stringify(formattedNote);
    const reducedString = jsonString
      .replace(/[{}",]/g, "")
    categorizedNotes[category].push(reducedString);
  });

  return JSON.stringify(categorizedNotes).replace(/["]/g, "");
};

export const convertMessageProToMessage = (messagesPro: MessagePro[]): Message[] => {
  return messagesPro.map((messagePro) => {
    const content = messagePro.parts
      .filter((part) => part.type === 'text' || part.type === 'data')
      .map((part) => part.content)
      .join(' ');

    return {
      role: messagePro.role,
      content,
    };
  });
}

export const removeFileExtension = (filename: string): string => {
  if (typeof (filename) !== 'string') return ''
  const lastIndex = filename.lastIndexOf(".");
  return lastIndex !== -1 ? filename.slice(0, lastIndex) : filename;
}

export async function getAudio() {
  const res = await fetch('/JoshuaSideras.wav');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.arrayBuffer()
}

export async function getMidi() {
  const res = await fetch('/JoshuaSideras.json');
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}