import React, { useEffect, useState } from 'react';

type CountdownProps = {
  targetDate: string; // ISO string date, e.g., "2024-12-31T00:00:00Z"
};

const Countdown = ({ targetDate }: CountdownProps) => {
  const [currentTargetDate, setCurrentTargetDate] = useState(new Date(targetDate));
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = currentTargetDate.getTime() - now.getTime();

      if (difference < 0) {
        // Calculate next target date, for example, add one year
        const nextYear = new Date(currentTargetDate.setFullYear(currentTargetDate.getFullYear() + 1));
        setCurrentTargetDate(nextYear);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTargetDate]);

  return (
    <div className="bg-black text-white overflow-hidden flex w-full h-[100px] items-center justify-center">
      <div className="whitespace-nowrap animate-marquee text-3xl">
        AYTEK'in Hayatımızdan çıkmasına son: 
        <span className=''>
          {`${timeLeft.days} gün : ${timeLeft.hours} saat : ${timeLeft.minutes} dakika`}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(50%); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Countdown;