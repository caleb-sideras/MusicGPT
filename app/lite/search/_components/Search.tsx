"use client";

import { useState } from 'react';
import { GeniusSearchApiResponse } from '@/types';
import SearchBar from './SearchBar';
import SongResults from './SongResults';

export default function Search() {
    const [data, setData] = useState<GeniusSearchApiResponse | null>(null);

    return (
        <>
            <SearchBar data={data} setData={setData} />
            <SongResults data={data} />
        </>
    )
}