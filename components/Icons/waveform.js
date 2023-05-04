// Waveform.js
import React from 'react';


const Waveform = ({ width = 150, height = 40, color="lightgrey" }) => {
    const rectWidth = (width * 20) / 200;
    const rectHeight1 = (height * 20) / 40;
    const rectHeight2 = (height * 30) / 40;
  
    return (
      <svg
        width={width}
        height={height+rectHeight1}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x={(width * 15) / 150}
          y={(height * 10) / 40}
          width={rectWidth}
          height={rectHeight1}
          rx={(rectWidth / 2)}
          fill={color}
          className="wave"
          style={{ animationDelay: '0s' }}
        />
        <rect
          x={(width * 55) / 150}
          y={(height * 5) / 40}
          width={rectWidth}
          height={rectHeight2}
          rx={(rectWidth / 2)}
          fill={color}
          className="wave"
          style={{ animationDelay: '0.2s' }}
        />
        <rect
          x={(width * 95) / 150}
          y={(height * 10) / 40}
          width={rectWidth}
          height={rectHeight1}
          rx={(rectWidth / 2)}
          fill={color}
          className="wave"
          style={{ animationDelay: '0.4s' }}
        />
        <rect
          x={(width * 135) / 150}
          y={(height * 5) / 40}
          width={rectWidth}
          height={rectHeight2}
          rx={(rectWidth / 2)}
          fill={color}
          className="wave"
          style={{ animationDelay: '0.6s' }}
        />
      </svg>
    );
  };

export default Waveform;
