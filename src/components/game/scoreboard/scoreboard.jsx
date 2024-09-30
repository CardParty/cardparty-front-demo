import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import './scoreboard.scss'

const Scoreboard = () => {
  const {
    gameState: { get: gameState },
  } = useContext(WebsocketContext);

  const scoreboardData = gameState?.scoreboard?.data || [];

  if (scoreboardData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="scoreboard-container scoreboard">
      <h1>Scoreboard</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scoreboardData.map((player, index) => (
            <tr key={index}>
              <td>{player.position}</td>
              <td>{player.username}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
