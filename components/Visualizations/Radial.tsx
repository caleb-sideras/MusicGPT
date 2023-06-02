import React, { useEffect, useRef, useState } from 'react';
// import Plotly from 'plotly.js-dist'; 
import { v4 as uuidv4 } from 'uuid';
import { Data, Layout } from 'plotly.js-basic-dist';

interface HPCPPlotProps {
    hpcpValues: Float32Array;
}

const HPCPPlot: React.FC<HPCPPlotProps> = ({ hpcpValues }) => {
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
    }, []);



    useEffect(() => {
        const data: Data[] = [
            {
                r: Array.from(hpcpValues),
                theta: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
                type: 'barpolar',
            },
        ];

        const layout: Partial<Layout> = {
            title: 'HPCP Radial Plot',
            plot_bgcolor: "transparent",
            paper_bgcolor: "#e1e3e3",
            autosize: true, // Re-render ALL graphs when screen goes below certain size, or remove them entirely.
            polar: {
                radialaxis: {
                    ticksuffix: '%',
                },
                angularaxis: {
                    direction: 'clockwise',
                },
            },
        };

        const plotHPCP = async () => {
            const Plotly = (await import('plotly.js')).default;
            Plotly.newPlot(divId.current, data, layout);
        }
        plotHPCP()

    }, [hpcpValues, divId, windowWidth]);

    return <div id={divId.current} className='w-full' />;
};

export default HPCPPlot;
