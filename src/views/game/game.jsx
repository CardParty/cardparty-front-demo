import React from 'react';
import Scoreboard from "../../components/game/scoreboard/scoreboard";
import Card from "../../components/game/card/card";
import Decisions from "../../components/game/decisions/decisions";
import InfoIsland from "../../components/game/infoIsland/infoIsland";
import './game.scss';

const Game = () => {
  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Game Title</h1>
      </header>
      <div className="game-body">
        <div className="left-column">
          <InfoIsland />
          <Decisions />
        </div>
        <div className="middle-column">
        <Card />
        </div>
        <div className="right-column">
          <Scoreboard />
        </div>
      </div>
    </div>
  );
};

export default Game;
