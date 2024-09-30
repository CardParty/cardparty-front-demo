import React, { useState, useEffect } from 'react';
import './infoIsland'

const InfoIsland = () => {
  const [time, setTime] = useState(0);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="info-island-container info-island">
      <h1>Time playing: {formatTime(time)}</h1>
    </div>
  );
};

export default InfoIsland;
