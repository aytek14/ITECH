import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const SlappableImage = () => {
  const [slapped, setSlapped] = useState(false);
  const [slapCount, setSlapCount] = useState(0);
  const slapSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    slapSound.current = new Audio('/hardSlap.mp3');
    const count = localStorage.getItem('slapCount');
    if (count) {
      setSlapCount(parseInt(count));
    }
  }, []);

  const handleSlap = () => {
    setSlapped(true);
    setTimeout(() => setSlapped(false), 500); // Reset the slap effect

    const newCount = slapCount + 1;
    setSlapCount(newCount);
    localStorage.setItem('slapCount', newCount.toString());

    if (slapSound.current) {
      slapSound.current.play();
    }
  };

  return (
    <div className="image-container flex flex-col items-center justify-center gap-8">
      <Image
        src="/3.png" // Replace with your image path
        alt="Slappable Image"
        width={300}
        height={200}
        className={`img-slap ${slapped ? 'slapped' : ''}`}
        onClick={handleSlap}
      />
      <button onClick={handleSlap} className="slap-button text-black font-inter font-bold text-2xl">
        Haydi Aytek Tokatla!
      </button>

      <p className='text-black text-xl font-inter'>Bugüne kadar Aytek <span className='font-inter font-bold text-2xl'>{slapCount} </span> kere tokatlandı!</p>
    </div>
  );
};

export default SlappableImage;