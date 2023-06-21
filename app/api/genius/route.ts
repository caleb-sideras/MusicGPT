import searchGenius from './utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const song = searchParams.get('song')
    const artist = searchParams.get('artist')

    if (typeof artist !== 'string' || typeof song !== 'string') {
        return new Response(JSON.stringify({ error: 'Both artist and song must be strings.' }), { status: 400 })
    }

    const geniusResult = await searchGenius(`${artist} ${song}`);
    return new Response(JSON.stringify(geniusResult), { status: 200 })
};