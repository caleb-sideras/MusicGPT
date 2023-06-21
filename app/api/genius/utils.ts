import axios, { AxiosResponse } from 'axios';

async function searchGenius(query: string): Promise<any> {
    const baseUrl = 'https://api.genius.com/search';
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}?q=${encodedQuery}`;
    console.log(url)

    let response: AxiosResponse;

    try {
        response = await axios.get<any>(url, {
            headers: {
                'Authorization': `Bearer JjTD_0JWGx__yo0cSQ8xbjkzZzi2NnxZYmGaeI9LHYxNqtl7kWEnKvCH4mH4tAl7`,
            },
        });
    } catch (error) {
        console.error('Error fetching data from Genius API:', error);
        return null;
    }

    return response.data;
}

export default searchGenius;

