"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GeniusSearchApiResponse, HighLevelData, LoaderType, LoadingState, Style } from "@/types";
import getRecordingByArtistAndTitle from '../_utils/utils'
import Artist from '@/components/Songs/Artist';
import { useHiddenData } from "@/utils/context/song_data_context";
import SmallLoader from '@/components/Loaders/SmallLoader';

type SongResultsProps = {
    data: GeniusSearchApiResponse | null
}


export default function SongResults({ data }: SongResultsProps) {
    const router = useRouter();

    const [selectedArtist, setSelectedArtist] = useState(null);
    const [selectedArtistState, setSelectedArtistState] = useState<LoadingState>(LoadingState.finished);
    const { setHiddenData } = useHiddenData();

    const extractSongData = (data: any) => {
        return {
            id: data.result.id,
            artist: data.result.primary_artist.name,
            title: data.result.title,
            // wrong
            duration: data.result.stats?.pageviews,
            year: data.result.release_date_components?.year,
            imageUrl: data.result?.song_art_image_thumbnail_url,
        };
    };

    const handleArtistClick = async (songData: any, artist: string, song: string) => {
        setSelectedArtist(songData.id);
        setSelectedArtistState(LoadingState.loading);

        const response = await getRecordingByArtistAndTitle(artist, song);

        const musicBrainz = response ? response : null;

        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (musicBrainz && musicBrainz.recordings) {
            const recordings: any = Object.values(musicBrainz.recordings).slice(0, 3);

            for (const release of recordings) {
                try {
                    const response = await axios.get(`/api/hld?mbid=${encodeURIComponent(release.id)}`);
                    const music_brainz_high = response.data as HighLevelData

                    if (music_brainz_high) {
                        setHiddenData({
                            id: release.id,
                            high_level: music_brainz_high,
                            low_level: null,
                            genius: null,
                        });

                        router.push(`/lite/chat/${songData.id}/${release.id}`);
                        return;
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error;
                        if (axiosError.response?.status === 429) {
                            console.error('Rate limit exceeded:', axiosError.response.data);
                        } else if (axiosError.response?.status === 500) {
                            console.error('Server error:', axiosError.response.data);
                        } else if (axiosError.response?.status === 404) {
                            console.error('Missing data:', axiosError.response.data);
                        }
                        else {
                            console.error('Unexpected error:', error);
                        }
                    } else {
                        console.error('Error fetching high-level data:', error);
                    }
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        setSelectedArtistState(LoadingState.failed);
        router.push(`/litee/chat/${songData.id}/1111`);
    };

    return (
        <>
            {
                data &&
                data.response.hits.map((hit) => {
                    const songData = extractSongData(hit);
                    const isCurrentArtistSelected = selectedArtist === songData.id;
                    const isAnotherArtistSelected = selectedArtist !== null && !isCurrentArtistSelected;
                    const shouldDisableClick = isAnotherArtistSelected && selectedArtistState !== LoadingState.failed;
                    return (
                        <>
                            <Artist
                                key={songData.id}
                                artist={songData.artist}
                                title={songData.title}
                                duration={songData.duration}
                                imageUrl={songData.imageUrl}
                                year={songData.year}
                                onClick={
                                    !shouldDisableClick
                                        ? () => handleArtistClick(songData, songData.artist, songData.title)
                                        : () => { }
                                }
                                style={Style.default}
                                className={shouldDisableClick ? 'pointer-events-none' : 'cursor-pointer'}
                            />
                            {selectedArtist === songData.id && (
                                <div className="mt-4">
                                    <SmallLoader height={25} width={50} waveformColor={'--md-sys-color-on-secondary'} textColor={'on-secondary'} bgColor={'secondary'}
                                        contents={[{ text: 'Finding that data source...', loadingState: selectedArtistState, loaderType: LoaderType.waveform }]} />
                                </div>
                            )}
                            <div className="border-t border-secondary w-full my-4"></div>
                        </>
                    );
                })
            }
        </>
    );
}