import React, { useCallback, useState } from 'react'
import { FileProps, LoadingState, LoaderType, ChatData, ProState } from '@/types';
import SmallLoader from '../Loaders/SmallLoader';

type UploadProps = {
    setChatData: React.Dispatch<React.SetStateAction<ChatData>>;
    chatData: ChatData
    setParentState: React.Dispatch<React.SetStateAction<ProState>>;
}

function Upload({ setChatData, chatData, setParentState}: UploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [fileLoad, setFileLoad] = useState<LoadingState>(LoadingState.finished)

    const handleFileUpload = async (file: File) => {
        if (!file) {
            return;
            // perform some checks
        }
        setChatData({...chatData, file: { name: file.name, file: file }});
        setParentState(ProState.convert)
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileUpload(file)
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            handleFileUpload(file)
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <div
                className={`w-full h-[200px] flex flex-col justify-center items-center rounded-b-lg ${isDragging && "bg-on-surface"}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <input
                    type="file"
                    id="fileInput"
                    hidden
                    accept="audio/*"
                    onChange={handleFileInputChange}
                    disabled={fileLoad === LoadingState.failed}
                />
                {
                    fileLoad == LoadingState.finished ?
                        <div className='flex flex-col justify-center'>
                            <div className="text-center text-xl font-bold">Drag & Drop</div>
                            <div className='text-center text-lg'>or <span className='underline'>Click</span></div>

                        </div>
                        :
                        <SmallLoader height={30} width={50} waveformColor={'--md-sys-color-surface'} textColor='surface' bgColor='on-surface' contents={[{ text: 'Formatting Audio File', loadingState: fileLoad, loaderType: LoaderType.waveform }]} />
                }

            </div>

        </>

    );
};

export default Upload