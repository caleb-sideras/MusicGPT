// pages/api/genius.ts

import { NextApiRequest, NextApiResponse } from 'next';
import searchGenius from '@/utils/api/search_genius';

const genius = async (req: NextApiRequest, res: NextApiResponse) => {
  const { artist, song } = req.query;

  if (typeof artist !== 'string' || typeof song !== 'string') {
    return res.status(400).json({ error: 'Both artist and song must be strings.' });
  }

  const geniusResult = await searchGenius(`${artist} ${song}`);
  res.status(200).json(geniusResult);
};

export default genius;