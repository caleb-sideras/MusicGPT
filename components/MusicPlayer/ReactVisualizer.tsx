import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
// import * as mm from '@magenta/music';
import { NoteSequence, INoteSequence, PianoRollSVGVisualizer, WaterfallSVGVisualizer, StaffSVGVisualizer, VisualizerConfig, urlToNoteSequence } from '@magenta/music';
import useDeepCompareEffect from 'use-deep-compare-effect';

const VISUALIZER_TYPES = ['piano-roll', 'waterfall', 'staff'] as const;
type VisualizerType = typeof VISUALIZER_TYPES[number];
type Visualizer = PianoRollSVGVisualizer | WaterfallSVGVisualizer | StaffSVGVisualizer;

interface VisualizerProps {
    src?: string;
    type?: VisualizerType;
    noteSequence?: INoteSequence;
    config?: VisualizerConfig;
}

export interface VisualizerHandle {
    redraw: (activeNote?: NoteSequence.INote) => void;
    clearActiveNotes: () => void;
    reload: () => void;
}

const Visualizer = forwardRef<VisualizerHandle, VisualizerProps>(
    ({ src, type = 'piano-roll', noteSequence, config = {} }, ref) => {
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [visualizer, setVisualizer] = useState<Visualizer | null>(null);
        const [ns, setNs] = useState<INoteSequence | null>(noteSequence as INoteSequence | null);

        useEffect(() => {
            setNs(noteSequence as INoteSequence | null);
        }, [noteSequence]);

        useEffect(() => {
            if (src) {
                setNs(null);
                urlToNoteSequence(src).then((sequence) => setNs(sequence));
            }
        }, [src]);

        useDeepCompareEffect(() => {
            initVisualizer();
        }, [ns, type, config]);

        const initVisualizer = () => {
            if (!wrapperRef.current || !ns) {
                return;
            }

            const wrapper = wrapperRef.current;
            wrapper.innerHTML = '';

            if (type === 'piano-roll') {
                wrapper.classList.add('piano-roll-visualizer', 'w-full', 'overflow-x-auto');
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                wrapper.appendChild(svg);
                setVisualizer(new PianoRollSVGVisualizer(ns, svg, config));
            } else if (type === 'waterfall') {
                wrapper.classList.add('waterfall-visualizer');
                setVisualizer(new WaterfallSVGVisualizer(ns, wrapper, config));
            } else if (type === 'staff') {
                wrapper.classList.add('staff-visualizer');
                const div = document.createElement('div');
                wrapper.appendChild(div);
                setVisualizer(new StaffSVGVisualizer(ns, div, config));
            }
        };

        useImperativeHandle(ref, () => ({
            redraw(activeNote?: NoteSequence.INote) {
                if (visualizer) {
                    visualizer.redraw(activeNote, activeNote != null);
                }
            },
            clearActiveNotes() {
                if (visualizer) {
                    visualizer.clearActiveNotes();
                }
            },
            reload() {
                initVisualizer();
            },
        }));

        return <div ref={wrapperRef}></div>;
    },
);

Visualizer.displayName = 'Visualizer';
export default Visualizer;