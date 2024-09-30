import React, {useState} from 'react';
import Scoreboard from "../../components/game/scoreboard/scoreboard";
import Card from "../../components/game/card/card";
import Decisions from "../../components/game/decisions/decisions";
import InfoIsland from "../../components/game/infoIsland/infoIsland";
import './game.scss';
import DebugConsolePopup from '../../popups/debug/DebugConsolePopup';

const Game = () => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const openConsole = () => {
    setIsConsoleOpen(true);
  };

  const closeConsole = () => {
    setIsConsoleOpen(false);
  };
  return (
    <div className="game-container">
            <button onClick={openConsole}>Otwórz Konsolę Debug</button>
            <DebugConsolePopup isOpen={isConsoleOpen} onClose={closeConsole} />
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
