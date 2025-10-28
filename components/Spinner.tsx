
import React from 'react';

interface SpinnerProps {
  participants: string[];
  colors: string[];
  rotation: number;
  isSpinning: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ participants, colors, rotation, isSpinning }) => {
  const segmentCount = participants.length > 1 ? participants.length : 12; // Default to 12 segments if empty
  const segmentAngle = 360 / segmentCount;

  const conicGradient = participants.length > 0 
    ? participants.map((_, i) => `${colors[i % colors.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')
    : colors.map((color, i) => `${color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ');

  return (
    <div className="relative w-[90%] max-w-[400px] md:max-w-full aspect-square rounded-full shadow-2xl">
      {/* Outer border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 p-2 animate-pulse">
        {/* Inner shadow and center button */}
        <div className="relative w-full h-full bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
          <div
            className="w-[95%] h-[95%] rounded-full transition-transform duration-[6000ms] ease-out"
            style={{
              background: `conic-gradient(${conicGradient})`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {participants.length > 0 && participants.map((participant, i) => (
              <div
                key={i}
                className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                style={{
                  transform: `rotate(${i * segmentAngle + segmentAngle / 2}deg) translateY(-25%)`,
                }}
              >
                <span 
                  className="text-white font-semibold text-xs sm:text-sm md:text-base break-all"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {participant.length > 10 ? participant.substring(0, 8) + '...' : participant}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-slate-700 rounded-full border-4 border-slate-600 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
