import { useContext, useState } from 'react';
import getRecordingByArtistAndTitle from '@/utils/api/artist_song';
import Artist from '@/components/Songs/Artist';
import axios, { AxiosResponse } from 'axios';
import SongDetails from '@/components/Songs/Artist';
import { ArtistData, GeniusSearchApiResponse, HighLevelData, LoaderType } from "@/types";
import { useRouter } from 'next/router';
import { useHiddenData } from "@/utils/context/song_data_context";
import SmallLoader from '@/components/Loaders/SmallLoader';
import { LoadingState } from '@/types';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Style } from '@/types';


const SearchComponent = () => {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [data, setData] = useState<GeniusSearchApiResponse | null>(null);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.finished);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedArtistState, setSelectedArtistState] = useState<LoadingState>(LoadingState.finished);
  const [error, setError] = useState(false);
  const { setHiddenData } = useHiddenData();
  const router = useRouter();


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

  const handleArtistClick = async (songData: any, artist: string, song:string) => {
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

            router.push({
              pathname: '/lite/chat',
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
    setSelectedArtistState(LoadingState.failed);
    // push just with genius id
    router.push({
      pathname: '/lite/chat',
      query: { genius: songData.id, music_brainz: 1111 },
    });
  };

  return (
    <div className="container mx-auto max-w-screen-sm flex flex-col justify-center sm:px-10 px-2">
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

      {error && <div className=" bg-error text-on-error rounded-lg p-4 text-center">Please enter both an artist and a song</div>}

      {
        loading === LoadingState.loading && <div className='mt-4'><SmallLoader height={25} width={50} waveformColor={'--md-sys-color-on-secondary'} textColor={'on-secondary'} bgColor={'secondary'}
          contents={[{ text: 'Searching the inter-webs for this banger', loadingState: LoadingState.loading, loaderType: LoaderType.waveform  }]} /></div>}
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
    </div>
  );
};

export default SearchComponent;