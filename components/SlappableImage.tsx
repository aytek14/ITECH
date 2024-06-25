import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const characters = [
  { id: 1, imageUrl: "/1.png", name: "Sudan çıkmış" },
  { id: 2, imageUrl: "/2.png", name: "Zirzop" },
  { id: 3, imageUrl: "/3.png", name: "Mert'i tokatla" },
];

const SlappableImage = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(
    characters[0].id
  );
  const [slapped, setSlapped] = useState(false);
  const [slapCount, setSlapCount] = useState(0);
  const slapSound = useRef<HTMLAudioElement | null>(null);
  const loveSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    slapSound.current = new Audio("/hardSlap.mp3");
    loveSound.current = new Audio("/loveSound.mp3");
    const count = localStorage.getItem("slapCount");
    if (count) {
      setSlapCount(parseInt(count));
    }
  }, []);

  const handleSlap = () => {
    setSlapped(true);
    setTimeout(() => setSlapped(false), 500); // Reset the slap effect

    const newCount = slapCount + 1;
    setSlapCount(newCount);
    localStorage.setItem("slapCount", newCount.toString());

    if (slapSound.current) {
      slapSound.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-black text-lg font-inter">
        Bugün Hangi Ayteki Tokatlamak İstersin?
      </p>
      <div className="grid grid-cols-3 gap-6">
        {characters.map((character) => (
          <div
            className="flex flex-col items-center justify-center h-44 w-full"
            key={character.id}
            onClick={() => setSelectedCharacterId(character.id)}
          >
            <Image
              src={character.imageUrl}
              alt={character.name}
              width={100}
              height={100}
              className={`cursor-pointer object-cover ${
                selectedCharacterId === character.id
                  ? "ring-4 rounded ring-blue-900"
                  : ""
              }`}
            />
            <p className="text-black text-lg font-inter pt-4">
              {character.name}
            </p>
          </div>
        ))}
      </div>
      <Image
        src={
          characters.find((char) => char.id === selectedCharacterId)
            ?.imageUrl || "/default.png" // Fallback image if not found
        }
        alt="Selected Character"
        width={260}
        height={200}
        className={`img-slap object-cover overflow-hidden ${
          slapped ? "slapped" : ""
        }`}
        onClick={handleSlap}
      />
      <button
        onClick={handleSlap}
        className="slap-button bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        {selectedCharacterId === 3
          ? "Mert'i Tokat Manyağı Yap!"
          : "Aytek'i Tokat Manyağı Yap!"}
      </button>
      <p className="text-black text-xl font-inter">
        Bugüne kadar {selectedCharacterId === 3 ? "Mert" : "Aytek"}{" "}
        <span className="font-inter font-bold text-2xl">{slapCount}</span> kere
        tokatlandı!
      </p>
    </div>
  );
};

export default SlappableImage;
