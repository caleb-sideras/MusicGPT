// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import "./styles.css";
// import { Midi } from "@tonejs/midi";
// import AllTracks from "../MIDI/AllTracks.json";
// import * as Tone from 'tone';

// interface MidiPlayerProps {
//     midiBuffer?: ArrayBuffer;
// }

// function MidiPlayer({ midiBuffer }: MidiPlayerProps) {
//     const [hoverButton, setHoverButton] = useState(false);
//     const fileDropRef = useRef<HTMLInputElement>(null);
//     const fileDropText = React.useRef<HTMLParagraphElement>(null);
//     let currentMidi = useRef<any>(null);
//     const synths = useRef<Tone.Sampler[]>([]);
//     const loops = useRef<Tone.Loop[]>([]);

//     useEffect(() => {
//         if (!Boolean(midiBuffer))
//             loadTrack(AllTracks);
//         else
//             parseBuffer(midiBuffer)
//     }, [midiBuffer]);

//     /* loadTrack and other unchanged */

//     const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (files && files.length > 0) {
//             const file = files[0];
//             document.querySelector("#FileDrop #Text")!.textContent = file.name;
//             parseFile(file);
//         }
//     }, []);

//     const handleDropClick = useCallback(() => fileDropRef.current!.click(), []);

//     const handlePlay = async () => {
//         await Tone.start();
//         const playing = Tone.Transport.state.valueOf() !== "started";
//         if (playing && currentMidi.current) {
//             playMidi(currentMidi.current);
//         } else {
//             stopMidi();
//         }
//     };

//     const playMidi = (midiFile: any) => {
//         // Play functionality, no changes
//     };

//     const stopMidi = () => {
//         // Stop functionality, no changes
//     };

//     const helpText = "Drop your MIDI file here (or click to select file)";
//     return (
//         <div>
//             <div id="FileDrop" ref={fileDropRef}
//                 onDragEnter={() => setHoverButton(true)}
//                 onDragLeave={() => setHoverButton(false)}
//                 onDrop={(e) => {
//                     e.preventDefault();
//                     setHoverButton(false);
//                     const files = e.dataTransfer.files;
//                     if (files && files.length > 0) {
//                         const file = files[0];
//                         fileDropText.current!.textContent = file.name;
//                         parseFile(file);
//                     }
//                 }}
//             >
//                 <p id="Text" ref={fileDropText}
//                     className={hoverButton ? 'Hover' : ''}
//                     onClick={handleDropClick}
//                 >
//                     {window.File ? helpText : 'Reading files not supported by this browser'}
//                 </p>
//                 <input type="file" hidden onChange={handleFileChange} />
//             </div>
//             <button onClick={handlePlay}>Play/Stop</button>
//         </div>
//     );
// }

// export default MidiPlayer;