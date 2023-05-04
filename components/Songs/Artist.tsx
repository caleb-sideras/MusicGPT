import React from 'react';
import { Style } from '@/types';

interface SongData {
  artist: string;
  title: string;
  duration: number;
  imageUrl: string;
  [key: string]: any;
  onClick?: () => void;
  style?: Style
}

function formatMillisecondsToMinutes(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default function Artist({ artist, title, duration, imageUrl, onClick, style = Style.default, ...props }: SongData) {
  return (
    <div
      className={`group flex items-center justify-between p-4 cursor-pointer duration-100
        ${style === Style.default ? 'bg-transparent hover:bg-surface-variant rounded-lg' :
          style === Style.lite ? 'group-hover:bg-surface-variant rounded-lg' :
            style === Style.home ? 'hover:bg-tertiary' :
              'text-on-surface'
        }`
      }
      onClick={onClick}>
      <div className='items-center gap-4 flex flex-row max-w-[70%]'>
        {imageUrl && <img src={imageUrl} alt={title} className="w-16 h-16 object-cover rounded-3xl" />}
        <div className='flex flex-col truncate'>
          <h2 className={`text-xl font-semibold overflow-hidden text-ellipsis
            ${style === Style.default ? 'text-on-background' :
              style === Style.lite ? 'text-on-surface-variant' :
                style === Style.home ? 'text-on-tertiary-container group-hover:text-on-tertiary' :
                  'text-on-surface'
            }
          `}>
            {title}
          </h2>
          <p className={`text-on-surface-variant overflow-hidden text-ellipsis
            ${style === Style.default ? '' :
              style === Style.lite ? '' :
                style === Style.home ? 'group-hover:text-tertiary-container' :
                  ''
            } 
          `}>
            {artist}
          </p>
        </div>
      </div>
      <p className={`text-on-surface-variant
        ${style === Style.default ? '' :
          style === Style.lite ? '' :
            style === Style.home ? 'group-hover:text-tertiary-container' :
              ''
        }`
      }>
        {formatMillisecondsToMinutes(duration)} min
      </p>
    </div>
  );
}