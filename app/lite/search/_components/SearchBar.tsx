"use client";

import { Dispatch, SetStateAction, useState } from "react";
import SmallLoader from "@/components/Loaders/SmallLoader";
import { GeniusSearchApiResponse, LoaderType, LoadingState } from "@/types";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import axios from 'axios';


type SearchBarProps = {
    data: GeniusSearchApiResponse | null
    setData: Dispatch<SetStateAction<GeniusSearchApiResponse | null>>
}

export default function SearchBar({ data, setData }: SearchBarProps) {

    const [loading, setLoading] = useState<LoadingState>(LoadingState.finished);
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');
    const [error, setError] = useState(false);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        if (artist.trim().length === 0 || song.trim().length === 0) {
            setError(true);
            return;
        }

        setError(false);
        setLoading(LoadingState.loading);
        const geniusResponse = await Promise.resolve(
            axios.get<GeniusSearchApiResponse>(`/api/genius?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`)
        );

        setData(geniusResponse.data);
        setLoading(LoadingState.finished);
    };

    return (
        <>
            <form onSubmit={handleSearch} className="space-y-4 mb-4">
                <div className='flex flex-row rounded-l-full rounded-r-full border-outline bg-secondary-container text-on-secondary-container items-center px-4 py-1'>
                    <div className='flex items-center justify-center h-[50%]'>
                        {loading === LoadingState.loading ? (
                            <button type="submit" disabled className="bg-transparent focus:outline-none focus:ring-transparent">
                                <MagnifyingGlassIcon className="w-5 h-5 text-on-tertiary-container" />
                            </button>
                        ) : (
                            <button type="submit" className="bg-transparent focus:outline-none focus:ring-transparent">
                                <MagnifyingGlassIcon className="w-5 h-5 text-on-secondary-container" />
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        id="artist"
                        value={artist}
                        placeholder="Artist"
                        onChange={(event) => setArtist(event.target.value)}
                        className="h-[60%] block -ml-1 w-full bg-transparent text-on-secondary-container py-2 px-4 focus:outline-none focus:ring-2 focus:ring-transparent"
                    />
                    <input
                        type="text"
                        id="song"
                        value={song}
                        placeholder="Song"
                        onChange={(event) => setSong(event.target.value)}
                        className="h-[60%] block w-full bg-transparent text-on-secondary-container py-2 px-3  focus:outline-none focus:ring-2 focus:ring-transparent"
                    />
                </div>
            </form>

            {
                error &&
                <div className=" bg-error text-on-error rounded-lg p-4 text-center">
                    Please enter both an artist and a song
                </div>
            }

            {
                loading === LoadingState.loading &&
                <div className='mt-4'>
                    <SmallLoader
                        height={25}
                        width={50}
                        waveformColor={'--md-sys-color-on-secondary'}
                        textColor={'on-secondary'}
                        bgColor={'secondary'}
                        contents={[{
                            text: 'Searching the inter-webs for this banger',
                            loadingState: LoadingState.loading,
                            loaderType: LoaderType.waveform
                        }]} />
                </div>
            }
        </>
    )

}