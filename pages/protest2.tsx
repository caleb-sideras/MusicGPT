import React, { useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import { Piano } from "@tonejs/piano";
import { PolySynth, Synth, now as ToneNow } from "tone";

const MidiPlayer: React.FC = () => {
  const [currentMidi, setCurrentMidi] = useState<Midi | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const playToggleRef = useRef<HTMLButtonElement>(null);
  const [synths, setSynths] = useState<PolySynth[]>([]);
  
  function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const midi = new Midi(e.target!.result as ArrayBuffer);
      setCurrentMidi(midi);
      textareaRef.current!.value = JSON.stringify(midi, undefined, 2);
      playToggleRef.current!.removeAttribute("disabled");
    };
    reader.readAsArrayBuffer(file);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      parseFile(file);
    }
  }

  function onPlayToggle() {
    const textarea = textareaRef.current;
    const playToggle = playToggleRef.current;
    
    const playing = playToggle?.getAttribute("data-playing") === "true";
    playToggle?.setAttribute("data-playing", (!playing).toString());
    
    
    if (!playing && currentMidi) {
      const now = ToneNow() + 0.5;
      currentMidi.tracks.forEach((track) => {
        const synth = new PolySynth(Synth, {
          envelope: {
            attack: 0.02,   
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        }).toDestination();
        
        setSynths((prevSynths) => [...prevSynths, synth]);
        
        track.notes.forEach(({ name, duration, time, velocity }) => {
          synth.triggerAttackRelease(name, duration, time + now, velocity);
        });
      });
    } else {
      for (const synth of synths) {
        synth.disconnect();
      }
      setSynths([]);
    }
  }

  return (
    <div>
      <input type="file" onChange={onFileInput} />
      <br />
      <textarea ref={textareaRef} cols={30} rows={10} readOnly />
      <br />
      <button ref={playToggleRef} data-playing="false" onClick={onPlayToggle}>
        Play/Pause
      </button>
    </div>
  );
};

export default MidiPlayer;