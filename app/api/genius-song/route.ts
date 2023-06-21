import axios, { AxiosError } from 'axios';
import { load as cheerioLoad } from 'cheerio';

const accessToken = 'JjTD_0JWGx__yo0cSQ8xbjkzZzi2NnxZYmGaeI9LHYxNqtl7kWEnKvCH4mH4tAl7';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    try {
        const url = `https://api.genius.com/songs/${id}?text_format=plain`
        console.log(url)
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const song = response.data.response.song;
        const artist_names = song.primary_artist.name;
        const apple_music_player_url = song.apple_music_player_url;
        const description = song.description.plain;
        const embed_content = song.embed_content;
        const full_title = song.full_title;
        const header_image_thumbnail_url = song.header_image_thumbnail_url;

        let lyrics = '';

        try {
            const pageResponse = await axios.get(song.url);
            const $ = cheerioLoad(pageResponse.data);

            $('.Lyrics__Container-sc-1ynbvzw-5').each((_, elem) => {
                $(elem).contents().each((_, child) => {
                    if (child.type === 'text') {
                        const trimmedData = child.data.trim();
                        if (trimmedData.startsWith('[') && trimmedData.endsWith(']')) { // Check for title lines
                            lyrics += trimmedData;
                        }
                        // @ts-ignore
                    } else if (child.tagName === 'a') {
                        lyrics += $(child).find('.ReferentFragmentdesktop__Highlight-sc-110r0d9-1').text();
                        // @ts-ignore
                    } else if (child.tagName === 'br') {
                        lyrics += '\n';
                    }
                });
            });
        } catch (lyricsError) {
            console.error('Error fetching lyrics:', lyricsError);
        }
        return new Response(JSON.stringify({
            artist_names: artist_names,
            apple_music_player_url: apple_music_player_url,
            description: description,
            embed_content: embed_content,
            full_title: full_title,
            header_image_thumbnail_url: header_image_thumbnail_url,
            lyrics: lyrics,
        }), {
            status: 200,
        })

    } catch (error) {
        console.error('Error fetching song:', error);

        if (axios.isAxiosError(error)) {
            const axiosError: AxiosError = error;
            if (axiosError.response) {
                return new Response(JSON.stringify(axiosError.response.data), { status: axiosError.response.status })
            } else {
                return new Response(JSON.stringify({ error: 'An error occurred while fetching the song.' }), { status: 500 })
            }
        } else {
            return new Response(JSON.stringify({ error: 'An error occurred while fetching the song.' }), { status: 500 })
        }
    }
};