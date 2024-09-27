import React from 'react';

const Scoreboard = ({ scoreboardData }) => {
  return (
    <div>
      <h3>Scoreboard</h3>
      {scoreboardData.map((data, index) => (
        <div key={index}>
          <p>{data.username}: {data.score}</p>
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;
