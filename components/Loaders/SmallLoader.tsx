import React, { useEffect, useState } from 'react'
import { loadingState } from "@/types";
import Waveform from "@/components/Icons/waveform"
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

type SmallLoaderProps = {
    height: number
    width: number
    waveformColor: string
    textColor: string
    bgColor: string
    contents: ContentsProps[]
}

type ContentsProps = {
    text: string;
    loading_state: loadingState;
}

function SmallLoader({ height = 25, width = 50, waveformColor = '--md-sys-color-tertiary-container', textColor ='on-tertiary-container',  bgColor='tertiary-container', contents }: SmallLoaderProps) {

    const [waveFormColor, setWaveFormColor] = useState<string>('')

    useEffect(() => {
        setWaveFormColor(getCssVarValue(waveformColor))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getStatusIcon = (status: loadingState) => {
        switch (status) {
            case loadingState.loading:
                return <Waveform width={width} height={height} color={waveFormColor} />
            case loadingState.finished:
                return <CheckCircledIcon className='textColor'/>;
            case loadingState.failed:
                return <CrossCircledIcon className='textColor'/>;
            default:
                return "";
        }
    };

    const getCssVarValue = (color: string) => {
        if (typeof window !== 'undefined') {
            return getComputedStyle(document.documentElement).getPropertyValue(color).trim();
        }
        return 'lightgrey';
    }

    return (
        // loop through contents and display them
        <div className="flex flex-col">
            <div className={`card filled gap-4 rounded flex-col flex p-6 text-${textColor} bg-${bgColor}`}>
                {contents.map((content, index) => (
                    <div key={index} className=' flex-row flex items-center'>
                        <div>{getStatusIcon(content.loading_state)}</div>
                        <span className="ml-4">{content.text}</span>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default SmallLoader