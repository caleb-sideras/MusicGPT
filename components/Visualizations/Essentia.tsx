"use client";

import React, { useEffect, useRef, useState } from 'react';
import { PlotMelodyContour, PlotHeatmap, LayoutMelodyContourPlot, LayoutChromaPlot, LayoutSpectrogramPlot } from '@/utils/essentia/display/plot';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    featureArray: Float32Array | any;
    audioFrameSize: number;
    audioSampleRate: number;
    hopSize?: number;
    plotTitle?: string;
    plotType?: string;
    colorscale?: string;
}

const PlotMelodyContourComponent: React.FC<Props> = ({ featureArray, audioFrameSize, audioSampleRate, plotTitle = 'Melody Contour Plot' }) => {
    const divId = useRef(uuidv4());
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const plotMelody = async () => {
            const Plotly = (await import('plotly.js')).default;
            const plot = new PlotMelodyContour(Plotly, divId.current, LayoutMelodyContourPlot);
            plot.create(featureArray, plotTitle, audioFrameSize, audioSampleRate);
            return () => plot.destroy();
        }
        plotMelody()

    }, [featureArray, windowWidth]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id={divId.current} className='w-full' />
    );
};

const PlotHeatmapComponent: React.FC<Props> = ({ featureArray, audioFrameSize, audioSampleRate, plotType = 'spectrogram', hopSize = 0, plotTitle = 'Chroma Plot', colorscale = 'Jet' }) => {
    const divId = useRef(uuidv4());
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const plotHeatmap = async () => {
            const Plotly = (await import('plotly.js')).default;
            const plot = new PlotHeatmap(Plotly, divId.current, plotType, plotType === 'chroma' ? LayoutChromaPlot : LayoutSpectrogramPlot);
            plot.create(featureArray, plotTitle, audioFrameSize, audioSampleRate, hopSize, colorscale);
            return () => plot.destroy();
        }
        plotHeatmap()
    }, [featureArray, windowWidth]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id={divId.current} className='w-full' />
    );
};

export { PlotMelodyContourComponent, PlotHeatmapComponent }
export type { Props }