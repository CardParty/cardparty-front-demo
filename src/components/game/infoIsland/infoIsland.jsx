import React, { useState, useEffect } from 'react';

const InfoIsland = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Timer: {time} seconds</h1>
    </div>
  );
};

export default InfoIsland;
