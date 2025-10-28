
import React, { useState, useCallback, useMemo } from 'react';
import Spinner from './components/Spinner';
import WinnerModal from './components/WinnerModal';
import { TrophyIcon } from './components/icons';

const SPINNER_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
];

const App: React.FC = () => {
  const [participantsInput, setParticipantsInput] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const parsedParticipants = useMemo(() => 
    participantsInput.split('\n').map(p => p.trim()).filter(p => p.length > 0)
  , [participantsInput]);

  const handleSpin = useCallback(() => {
    if (parsedParticipants.length < 2) {
      setError('Please enter at least two participants.');
      return;
    }
    setError(null);
    setParticipants(parsedParticipants);
    setWinner(null);
    setIsSpinning(true);

    const fullRotations = 5;
    const segmentAngle = 360 / parsedParticipants.length;
    const randomSegment = Math.floor(Math.random() * parsedParticipants.length);
    const randomAngleWithinSegment = Math.random() * segmentAngle;
    
    const targetRotation = (fullRotations * 360) + (randomSegment * segmentAngle) + randomAngleWithinSegment;
    
    // Invert rotation direction and add offset to align with the top pointer
    const finalRotation = 360 - (targetRotation % 360);
    const pointerOffset = segmentAngle / 2;
    const newRotation = rotation + targetRotation + pointerOffset;

    setRotation(newRotation);

    setTimeout(() => {
      const winnerIndex = Math.floor((finalRotation) / segmentAngle);
      setWinner(parsedParticipants[winnerIndex]);
      setIsSpinning(false);
    }, 6000); // Should match transition duration in Spinner.tsx

  }, [parsedParticipants, rotation]);

  const handleReset = useCallback(() => {
    setParticipantsInput('');
    setParticipants([]);
    setWinner(null);
    setIsSpinning(false);
    setRotation(0);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center gap-3">
          <TrophyIcon className="w-8 h-8 md:w-10 md:h-10" />
          Raffle Winner Spinner
        </h1>
        <p className="text-slate-400 mt-2">Enter names and spin the wheel to find a winner!</p>
      </header>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative flex items-center justify-center aspect-square">
          <div className="absolute top-[-10px] z-10">
            <div className="w-0 h-0 
              border-l-[15px] border-l-transparent
              border-r-[15px] border-r-transparent
              border-t-[30px] border-t-yellow-400">
            </div>
          </div>
          <Spinner participants={participants} colors={SPINNER_COLORS} rotation={rotation} isSpinning={isSpinning} />
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-2xl space-y-4">
          <div>
            <label htmlFor="participants" className="block text-sm font-medium text-slate-300 mb-2">
              Participants (one per line)
            </label>
            <textarea
              id="participants"
              value={participantsInput}
              onChange={(e) => setParticipantsInput(e.target.value)}
              disabled={isSpinning}
              rows={8}
              placeholder="Alice&#10;Bob&#10;Charlie&#10;Dave"
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
            />
             {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSpin}
              disabled={isSpinning || parsedParticipants.length === 0}
              className="w-full flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>
            <button
              onClick={handleReset}
              disabled={isSpinning}
              className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-md shadow-lg transition disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </main>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} onSpinAgain={handleReset} />}
    </div>
  );
};

export default App;
