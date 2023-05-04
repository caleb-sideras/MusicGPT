import { useContext, useState } from 'react';
import getRecordingByArtistAndTitle from '@/utils/api/artist_song';
import Artist from '@/components/Songs/Artist';
import axios, { AxiosResponse } from 'axios';
import SongDetails from '@/components/Songs/Artist';
import { ArtistData, GeniusSearchApiResponse, HighLevelData } from "@/types";
import { useRouter } from 'next/router';
import { useHiddenData } from "@/utils/context/song_data_context";
import SmallLoader from '@/components/Loaders/SmallLoader';
import { loadingState } from '@/types';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchComponent = () => {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [data, setData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState<loadingState>(loadingState.finished);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedArtistState, setSelectedArtistState] = useState<loadingState>(loadingState.finished);
  const { setHiddenData } = useHiddenData();
  const router = useRouter();


  const handleSearch = async (event: React.FormEvent) => {
    setLoading(loadingState.loading);
    event.preventDefault();
    const [geniusResponse, musicBrainzResult] = await Promise.all([
      axios.get<GeniusSearchApiResponse>(`/api/genius?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`),
      getRecordingByArtistAndTitle(artist, song),
    ]);
    console.log(geniusResponse, musicBrainzResult)

    setData({ genius: geniusResponse.data, musicBrainz: musicBrainzResult });
    setLoading(loadingState.finished);
  };

  const extractSongData = (data: any) => {
    return {
      id: data.result.id,
      artist: data.result.primary_artist.name,
      title: data.result.title,
      duration: data.result.stats.pageviews,
      imageUrl: data.result.song_art_image_thumbnail_url,
    };
  };

  const handleArtistClick = async (songData: any, musicBrainz: any) => {
    setSelectedArtist(songData.id);
    setSelectedArtistState(loadingState.loading);
    if (musicBrainz && musicBrainz.recordings) {
      console.log(musicBrainz.recordings);
      const recordings = Object.values(musicBrainz.recordings).slice(0, 5);

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

            router.push({
              pathname: '/chat',
              query: { genius: songData.id, music_brainz: release.id },
            });
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
    setSelectedArtistState(loadingState.failed);
    // push just with genius id
    router.push({
      pathname: '/chat',
      query: { genius: songData.id, music_brainz: 1111 },
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSearch} className="space-y-4 mb-4">
        <div className="flex flex-row">
          <div className='flex flex-row rounded-l-full rounded-r-full border-outline bg-tertiary-container items-center px-4 py-1'>
            <div className='flex items-center justify-center h-[50%]'>
              {loading === loadingState.loading ? (
                <button type="submit" disabled className="bg-transparent focus:outline-none focus:ring-transparent">
                  <MagnifyingGlassIcon className="w-5 h-5 text-on-tertiary-container" />
                </button>
              ) : (
                <button type="submit" className="bg-transparent focus:outline-none focus:ring-transparent">
                  <MagnifyingGlassIcon className="w-5 h-5 text-on-tertiary-container" />
                </button>
              )}
            </div>
            <input
              type="text"
              id="artist"
              value={artist}
              placeholder="Artist"
              onChange={(event) => setArtist(event.target.value)}
              className="h-[60%] block -ml-1 w-full bg-transparent text-on-tertiary-container py-2 px-4 focus:outline-none focus:ring-2 focus:ring-transparent"
            />
            <input
              type="text"
              id="song"
              value={song}
              placeholder="Song"
              onChange={(event) => setSong(event.target.value)}
              className="h-[60%] block w-full bg-transparent text-on-tertiary-container py-2 px-3  focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>
        </div>
      </form>

      {
        loading === loadingState.loading && <SmallLoader height={25} width={50} color={'--md-sys-color-tertiary-container'}
          contents={[{ text: 'Searching the inter-webs for this banger', loading_state: loadingState.loading }]} />}
      {
        data &&
        data.genius &&
        data.genius.response.hits.map((hit) => {
          const songData = extractSongData(hit);
          const isCurrentArtistSelected = selectedArtist === songData.id;
          const isAnotherArtistSelected = selectedArtist !== null && !isCurrentArtistSelected;
          const shouldDisableClick = isAnotherArtistSelected && selectedArtistState !== loadingState.failed;
          return (
            <>
              <Artist
                key={songData.id}
                artist={songData.artist}
                title={songData.title}
                duration={songData.duration}
                imageUrl={songData.imageUrl}
                onClick={
                  !shouldDisableClick
                    ? () => handleArtistClick(songData, data.musicBrainz)
                    : () => { }
                }
                className={shouldDisableClick ? 'pointer-events-none' : 'cursor-pointer'}
              />
              {selectedArtist === songData.id && (
                <div>
                  <SmallLoader height={25} width={50} color={'--md-sys-color-tertiary-container'}
                    contents={[{ text: 'Finding that data source...', loading_state: selectedArtistState }]} />
                </div>
              )}
              <div className="border-t border-on-surface-variant w-full my-4"></div>
            </>
          );
        })
      }
    </div>
  );
};

export default SearchComponent;