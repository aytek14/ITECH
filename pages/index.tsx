import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Add mode type
interface GameMode {
  id: string;
  name: string;
  icon: string;
}

interface SlapHandProps {
  isSlapping: boolean;
  mode: string;
}

interface Character {
  id: number;
  imageUrl: string;
  name: string;
}

// Updated Attack Effect Component with Pie Mode
const AttackEffect: React.FC<SlapHandProps> = ({ isSlapping, mode }) => {
  if (mode === 'pie') {
    return (
      <div
        className={`absolute -right-12 top-1/2 -translate-y-1/2 transform transition-all duration-200 pointer-events-none
        ${isSlapping ? "translate-x-12 scale-150 opacity-0" : "translate-x-64 rotate-0 opacity-100"}`}
      >
        <Image
          src="/pieImage.png"
          alt="Pie Attack"
          width={200}
          height={200}
          className={`drop-shadow-xl transition-all duration-300 ${isSlapping ? 'rotate-12' : ''}`}
        />
      </div>
    );
  }
  
  if (mode === 'shark') {
    return (
      <div
        className={`absolute -right-12 top-1/2 -translate-y-1/2 transform transition-all duration-300 pointer-events-none
        ${isSlapping ? "translate-x-12 scale-125 -rotate-12" : "translate-x-64 rotate-0"}`}
      >
        <Image
          src="/sharky.png"
          alt="Shark Attack"
          width={400}
          height={400}
          className={`drop-shadow-xl transition-all duration-300 ${isSlapping ? 'brightness-110' : ''}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute -right-12 top-1/2 -translate-y-1/2 transform transition-all duration-200 pointer-events-none
      ${isSlapping ? "translate-x-12 rotate-12" : "translate-x-64"}`}
    >
      <Image
        src="/handImage.png"
        alt="Slapping Hand"
        width={300}
        height={300}
        className="drop-shadow-xl transform -rotate-45"
      />
    </div>
  );
};

const GameContent: React.FC = () => {
  const characters: Character[] = [
    { id: 1, imageUrl: "/1.png", name: "Sudan çıkmış" },
    { id: 2, imageUrl: "/2.png", name: "Zirzop" },
    { id: 3, imageUrl: "/3.png", name: "Mert'i tokatla" },
  ];

  const gameModes: GameMode[] = [
    { id: "slap", name: "Slap Mode", icon: "🖐️" },
    { id: "shark", name: "Shark Mode", icon: "🦈" },
    { id: "pie", name: "Pie Mode", icon: "🥧" },
  ];

  const [selectedMode, setSelectedMode] = useState<string>("slap");
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);
  const [slapped, setSlapped] = useState<boolean>(false);
  const [isSlapping, setIsSlapping] = useState<boolean>(false);
  const [slapCount, setSlapCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [lastSlapTime, setLastSlapTime] = useState<number>(Date.now());
  const [showCream, setShowCream] = useState<boolean>(false);
  const slapSound = useRef<HTMLAudioElement | null>(null);
  const sharkSound = useRef<HTMLAudioElement | null>(null);
  const pieSound = useRef<HTMLAudioElement | null>(null);
  const comboTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    slapSound.current = new Audio("/hardSlap.mp3");
    sharkSound.current = new Audio("/girlScream.mp3");
    pieSound.current = new Audio("/facePie.mp3"); 
    const savedCount = localStorage.getItem("slapCount");
    if (savedCount) setSlapCount(parseInt(savedCount));
  }, []);

  const handleSlap = (): void => {
    const now = Date.now();
    const timeSinceLastSlap = now - lastSlapTime;
    
    setSlapped(true);
    setIsSlapping(true);

    if (selectedMode === 'pie') {
      setShowCream(true);
      setTimeout(() => setShowCream(false), 1000);
    }

    // Reset slap animations with different timings for each mode
    setTimeout(() => {
      setSlapped(false);
      setIsSlapping(false);
    }, selectedMode === 'pie' ? 500 : selectedMode === 'shark' ? 400 : 300);

    if (timeSinceLastSlap < 2000) {
      setCombo(prev => prev + 1);
      if (comboTimeout.current) {
        clearTimeout(comboTimeout.current);
      }
    } else {
      setCombo(1);
    }

    comboTimeout.current = setTimeout(() => setCombo(0), 2000);
    setLastSlapTime(now);

    const newCount = slapCount + 1;
    setSlapCount(newCount);
    localStorage.setItem("slapCount", newCount.toString());

    // Play appropriate sound effect
    let sound;
    switch(selectedMode) {
      case 'shark':
        sound = sharkSound.current;
        break;
      case 'pie':
        sound = pieSound.current;
        break;
      default:
        sound = slapSound.current;
    }
    
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  const getModeColors = (mode: string) => {
    switch(mode) {
      case 'shark':
        return {
          button: 'from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800',
          particles: 'bg-red-500',
          text: 'text-red-300'
        };
      case 'pie':
        return {
          button: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
          particles: 'bg-white',
          text: 'text-yellow-200'
        };
      default:
        return {
          button: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          particles: 'bg-yellow-400',
          text: 'text-blue-300'
        };
    }
  };

  const getActionText = (mode: string) => {
    switch(mode) {
      case 'shark':
        return 'BITE!';
      case 'pie':
        return 'SPLAT!';
      default:
        return 'SLAP!';
    }
  };

  const colors = getModeColors(selectedMode);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selection */}
      <div className="flex justify-center gap-4 mb-8">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`px-6 py-3 rounded-full text-lg font-bold transition-all
              ${selectedMode === mode.id
                ? `bg-gradient-to-r ${getModeColors(mode.id).button} text-white scale-110`
                : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
          >
            <span className="mr-2">{mode.icon}</span>
            {mode.name}
          </button>
        ))}
      </div>

      {/* Character Selection */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => setSelectedCharacter(char)}
            className={`relative group cursor-pointer transition-transform hover:scale-105 ${
              selectedCharacter.id === char.id
                ? "ring-4 ring-blue-400 rounded-lg"
                : ""
            }`}
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
              <Image
                src={char.imageUrl}
                alt={char.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:brightness-110 transition-all"
              />
            </div>
            <div className="absolute inset-0 flex items-end justify-center p-4">
              <span className="text-lg font-semibold bg-black/50 px-3 py-1 rounded-full">
                {char.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-8">
        <div className="relative inline-block mb-4">
          <div className="flex items-center justify-center">
            <div
              className={`transform transition-all duration-200 relative ${
                slapped 
                  ? selectedMode === 'shark' 
                    ? 'scale-90 brightness-75'
                    : selectedMode === 'pie'
                    ? 'scale-95'
                    : 'scale-95 rotate-12'
                  : ''
              }`}
            >
              <Image
                src={selectedCharacter.imageUrl}
                alt={selectedCharacter.name}
                width={300}
                height={300}
                className="rounded-xl shadow-2xl cursor-pointer"
                onClick={handleSlap}
              />
              {/* Cream overlay for pie mode */}
              {showCream && selectedMode === 'pie' && (
                <div className="absolute inset-0 bg-white/80 rounded-xl animate-fade-out" />
              )}
            </div>

            <AttackEffect isSlapping={isSlapping} mode={selectedMode} />
          </div>

          {/* Combo Counter */}
          {combo > 1 && (
            <div className="absolute -top-8 right-0 px-4 py-2 rounded-full animate-bounce bg-opacity-90 text-white"
                 style={{ backgroundColor: selectedMode === 'pie' ? '#f59e0b' : selectedMode === 'shark' ? '#dc2626' : '#ef4444' }}>
              {combo}x {selectedMode === 'pie' ? 'Splat' : selectedMode === 'shark' ? 'Bite' : 'Slap'} Combo!
            </div>
          )}

          {/* Attack Effect Particles */}
          {isSlapping && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="flex items-center justify-center">
                {[...Array(selectedMode === 'pie' ? 12 : selectedMode === 'shark' ? 8 : 6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute ${selectedMode === 'pie' ? 'animate-splat' : 'animate-ping'}`}
                    style={{
                      transform: `rotate(${i * (360 / (selectedMode === 'pie' ? 12 : selectedMode === 'shark' ? 8 : 6))}deg) 
                                translateX(${selectedMode === 'pie' ? '70' : '50'}px)`,
                    }}
                  >
                    <div 
                      className={`${
                        selectedMode === 'pie'
                          ? 'h-2 w-2 bg-white'
                          : selectedMode === 'shark'
                          ? 'h-3 w-3 bg-red-500'
                          : 'h-4 w-4 bg-yellow-400'
                      } rounded-full opacity-75`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSlap}
            className={`text-white text-xl font-bold py-4 px-12
              rounded-full transform hover:scale-105 
              transition-all shadow-lg relative overflow-hidden group
              bg-gradient-to-r ${colors.button}`}
          >
            <span className="relative z-10">{getActionText(selectedMode)}</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </div>

        <div className="space-y-2 mt-6">
          <div className="text-3xl font-bold">
            Total {selectedMode === 'pie' ? 'Splats' : selectedMode === 'shark' ? 'Bites' : 'Slaps'}: {slapCount}
          </div>
          <div className={colors.text}>
            Keep {selectedMode === 'pie' ? 'splatting' : selectedMode === 'shark' ? 'biting' : 'slapping'} quickly for combo bonus!
          </div>
        </div>
      </div>

      {/* Add splat animation */}
      <style jsx global>{`
        @keyframes splat {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(2) rotate(45deg); opacity: 0; }
        }
        .animate-splat {
          animation: splat 0.5s ease-out forwards;
        }
        @keyframes fade-out {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameContent;
