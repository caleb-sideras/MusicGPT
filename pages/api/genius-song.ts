import axios, { AxiosError } from 'axios';
import { load as cheerioLoad } from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

const accessToken = 'JjTD_0JWGx__yo0cSQ8xbjkzZzi2NnxZYmGaeI9LHYxNqtl7kWEnKvCH4mH4tAl7';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    try {
        const response = await axios.get(`https://api.genius.com/songs/${id}?text_format=plain`, {
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
                    } else if (child.tagName === 'a') {
                        lyrics += $(child).find('.ReferentFragmentdesktop__Highlight-sc-110r0d9-1').text();
                    } else if (child.tagName === 'br') {
                        lyrics += '\n';
                    }
                });
            });
        } catch (lyricsError) {
            console.error('Error fetching lyrics:', lyricsError);
        }

        res.status(200).json({
            artist_names: artist_names,
            apple_music_player_url: apple_music_player_url,
            description: description,
            embed_content: embed_content,
            full_title: full_title,
            header_image_thumbnail_url: header_image_thumbnail_url,
            lyrics: lyrics,
        });

    } catch (error) {
        console.error('Error fetching song:', error);

        if (axios.isAxiosError(error)) {
            const axiosError: AxiosError = error;
            if (axiosError.response) {
                res.status(axiosError.response.status).json(axiosError.response.data);
            } else {
                res.status(500).json({ error: 'An error occurred while fetching the song.' });
            }
        } else {
            res.status(500).json({ error: 'An error occurred while fetching the song.' });
        }
    }
};
