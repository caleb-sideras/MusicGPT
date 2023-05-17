import {PlayerElement, NoteEvent} from './player';
import {VisualizerElement} from './visualizer';

export {PlayerElement, VisualizerElement};
export type {NoteEvent}

window.customElements.define('midi-player', PlayerElement);
window.customElements.define('midi-visualizer', VisualizerElement);
