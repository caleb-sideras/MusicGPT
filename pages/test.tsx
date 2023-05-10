import React, { useEffect } from 'react';
import 'html-midi-player';
import 'focus-visible';
import { midiBuffer } from './midiBuffer'; // Replace this with your own MIDI buffer import

interface MidiPlayerComponentProps {
  midiBuffer: ArrayBuffer;
}

const MidiPlayerComponent: React.FC<MidiPlayerComponentProps> = ({ midiBuffer }) => {
  const midiDataURL = `data:audio/midi;base64,${btoa(
    String.fromCharCode(...new Uint8Array(midiBuffer))
  )}`;

  return (
    <div>
      <p>
        This is a demo for the <strong>html-midi-player</strong> package. For more information, see{' '}
        <a
          href="https://github.com/cifkao/html-midi-player"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          its GitHub repository
        </a>
        .
      </p>

      <section id="section3" className="my-4">
        <h2 className="text-xl font-bold mb-2">Custom player and visualizer style</h2>
        <midi-player
          src={midiDataURL}
          sound-font
          visualizer="#section3 midi-visualizer"
          className="block w-full mb-0"
        ></midi-player>
        <midi-visualizer src={midiDataURL} className="rounded-b-md bg-yellow-200 border-2 border-black"></midi-visualizer>
      </section>
    </div>
  );
};

export default MidiPlayerComponent;
