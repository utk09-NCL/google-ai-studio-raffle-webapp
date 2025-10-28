
import React, { useEffect, useState } from 'react';
import { StarIcon, TrophyIcon } from './icons';

interface WinnerModalProps {
  winner: string;
  onClose: () => void;
  onSpinAgain: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-2" style={style}></div>
);

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose, onSpinAgain }) => {
  const [confetti, setConfetti] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newConfetti = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${-20 - Math.random() * 100}%`,
      transform: `rotate(${Math.random() * 360}deg)`,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
      animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
      opacity: 1,
    }));
    setConfetti(newConfetti);

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', keydownHandler);

    return () => window.removeEventListener('keydown', keydownHandler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <style>
        {`
          @keyframes fall {
            to {
              top: 120%;
              transform: rotate(${Math.random() * 720}deg);
              opacity: 0;
            }
          }
          @keyframes modal-pop {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      <div className="relative bg-slate-800 border-2 border-yellow-400 rounded-2xl shadow-2xl w-full max-w-md text-center p-8 overflow-hidden" style={{ animation: 'modal-pop 0.3s ease-out' }}>
        {confetti.map((style, index) => (
          <ConfettiPiece key={index} style={style} />
        ))}
        
        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-yellow-400 rounded-full -mt-20 mb-6 border-4 border-slate-800">
          <TrophyIcon className="w-12 h-12 text-yellow-900" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-300">The Winner Is...</h2>
        <p className="text-4xl md:text-5xl font-extrabold my-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 break-words">
          {winner}
        </p>

        <div className="flex justify-center my-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
          ))}
        </div>
        
        <p className="text-slate-400 mb-8">Congratulations to the lucky winner!</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={onSpinAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
                Start New Raffle
            </button>
            <button
                onClick={onClose}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
