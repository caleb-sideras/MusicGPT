import axios, { AxiosResponse } from 'axios';

async function getRecordingByArtistAndTitle(artist: string, title: string): Promise<any | null> {
    const baseUrl = 'https://musicbrainz.org/ws/2/recording';
    const query = `artist:"${artist}" AND recording:"${title}"`;
    const params = {
        query: query,
        fmt: 'json',
    };

    let response: AxiosResponse;
    try {
        response = await axios.get(baseUrl, { params: params });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return null;
        }
        throw error;
    }

    return response.data;
}

export default getRecordingByArtistAndTitle;
