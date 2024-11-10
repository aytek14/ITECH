import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Type definitions
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

// Background Animation Component
const AnimatedBackground: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-blue-900/50 to-black/50" />
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white/5 backdrop-blur-sm animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 30 + 10}px`,
          height: `${Math.random() * 30 + 10}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }}
      />
    ))}
  </div>
);

// Attack Effect Component
const AttackEffect: React.FC<SlapHandProps> = ({ isSlapping, mode }) => {
  if (mode === "pie") {
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
          className={`drop-shadow-xl transition-all duration-300 ${isSlapping ? "rotate-12" : ""}`}
        />
      </div>
    );
  }

  if (mode === "shark") {
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
          className={`drop-shadow-xl transition-all duration-300 ${isSlapping ? "brightness-110" : ""}`}
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

// Score Display Component
const ScoreDisplay: React.FC<{
  score: number;
  combo: number;
  mode: string;
}> = ({ score, combo, mode }) => {
  const getModeEmoji = (mode: string) => {
    switch (mode) {
      case "shark":
        return "🦈";
      case "pie":
        return "🥧";
      default:
        return "🖐️";
    }
  };

  return (
    <div
      className="fixed top-4 right-4 bg-black/30 backdrop-blur-sm rounded-2xl p-4 
                    text-white shadow-xl border border-white/10 z-50"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getModeEmoji(mode)}</span>
        <div>
          <div className="font-bold">Score: {score}</div>
          {combo > 1 && (
            <div className="text-yellow-400 animate-pulse">{combo}x Combo!</div>
          )}
        </div>
      </div>
    </div>
  );
};

const GameContent: React.FC = () => {
  const characters: Character[] = [
    { id: 1, imageUrl: "/1.png", name: "Sudan Cikmis" },
    { id: 2, imageUrl: "/2.png", name: "ZirZop" },
    { id: 3, imageUrl: "/3.png", name: "Mert" },
  ];

  const gameModes: GameMode[] = [
    { id: "slap", name: "Slap Mode", icon: "🖐️" },
    { id: "shark", name: "Shark Mode", icon: "🦈" },
    { id: "pie", name: "Pie Mode", icon: "🥧" },
  ];

  const [selectedMode, setSelectedMode] = useState<string>("slap");
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(
    characters[0]
  );
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

    if (selectedMode === "pie") {
      setShowCream(true);
      setTimeout(() => setShowCream(false), 1000);
    }

    setTimeout(
      () => {
        setSlapped(false);
        setIsSlapping(false);
      },
      selectedMode === "pie" ? 500 : selectedMode === "shark" ? 400 : 300
    );

    if (timeSinceLastSlap < 2000) {
      setCombo((prev) => prev + 1);
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

    let sound;
    switch (selectedMode) {
      case "shark":
        sound = sharkSound.current;
        break;
      case "pie":
        sound = pieSound.current;
        break;
      default:
        sound = slapSound.current;
    }

    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const getModeColors = (mode: string) => {
    switch (mode) {
      case "shark":
        return {
          button:
            "from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800",
          particles: "bg-red-500",
          text: "text-red-300",
        };
      case "pie":
        return {
          button:
            "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
          particles: "bg-white",
          text: "text-yellow-200",
        };
      default:
        return {
          button:
            "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
          particles: "bg-yellow-400",
          text: "text-blue-300",
        };
    }
  };

  const getActionText = (mode: string) => {
    switch (mode) {
      case "shark":
        return "BITE!";
      case "pie":
        return "SPLAT!";
      default:
        return "SLAP!";
    }
  };

  const colors = getModeColors(selectedMode);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatedBackground />

      {/* Game Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-4 py-3 rounded-full text-base md:text-lg font-bold 
                transition-all transform hover:scale-105 active:scale-95
                ${
                  selectedMode === mode.id
                    ? `bg-gradient-to-r ${getModeColors(mode.id).button} text-white scale-105 shadow-lg`
                    : "bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
                }`}
            >
              <span className="text-xl md:text-2xl mr-2">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Character Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 mb-8">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className={`relative cursor-pointer transition-all
                transform hover:scale-105 active:scale-95
                ${
                  selectedCharacter.id === char.id
                    ? "ring-4 ring-blue-400/50 shadow-lg shadow-blue-500/30 rounded-2xl"
                    : ""
                }`}
            >
              <div
                className="aspect-square relative overflow-hidden rounded-2xl 
                            bg-black/30 backdrop-blur-sm border border-white/10"
              >
                <Image
                  src={char.imageUrl}
                  alt={char.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <span className="text-xl md:text-3xl font-bold text-white">
                    {char.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Arena */}
        <div
          className="relative rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 
                      p-4 md:p-8 mb-8 shadow-2xl"
        >
          <div className="text-center space-y-6">
            <div className="relative inline-block mb-4">
              <div className="flex items-center justify-center">
                <div
                  className={`transform transition-all duration-200 relative ${
                    slapped
                      ? selectedMode === "shark"
                        ? "scale-90 brightness-75"
                        : selectedMode === "pie"
                          ? "scale-95"
                          : "scale-95 rotate-12"
                      : ""
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
                  {showCream && selectedMode === "pie" && (
                    <div className="absolute inset-0 bg-white/80 rounded-xl animate-fade-out" />
                  )}
                </div>

                <AttackEffect isSlapping={isSlapping} mode={selectedMode} />
              </div>

              {isSlapping && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="flex items-center justify-center">
                    {[
                      ...Array(
                        selectedMode === "pie"
                          ? 12
                          : selectedMode === "shark"
                            ? 8
                            : 6
                      ),
                    ].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute ${selectedMode === "pie" ? "animate-splat" : "animate-ping"}`}
                        style={{
                          transform: `rotate(${i * (360 / (selectedMode === "pie" ? 12 : selectedMode === "shark" ? 8 : 6))}deg) 
                                    translateX(${selectedMode === "pie" ? "70" : "50"}px)`,
                        }}
                      >
                        <div
                          className={`${
                            selectedMode === "pie"
                              ? "h-2 w-2 bg-white"
                              : selectedMode === "shark"
                                ? "h-3 w-3 bg-red-500"
                                : "h-4 w-4 bg-yellow-400"
                          } rounded-full opacity-75`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleSlap}
              className={`relative group overflow-hidden
                px-8 py-4 rounded-full text-xl md:text-2xl font-bold
                transform hover:scale-105 active:scale-95 transition-all
                bg-gradient-to-r ${colors.button} shadow-lg`}
            >
              <span className="relative z-10">
                {getActionText(selectedMode)}
              </span>
              <div
                className="absolute inset-0 bg-white/20 opacity-0 
                      group-hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Score Display */}
      <ScoreDisplay score={slapCount} combo={combo} mode={selectedMode} />

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes splat {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(2) rotate(45deg);
            opacity: 0;
          }
        }
        .animate-splat {
          animation: splat 0.5s ease-out forwards;
        }
        @keyframes fade-out {
          0% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-out forwards;
        }
        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GameContent;
