import React, { useState, useEffect } from 'react';
import Scoreboard from "../../components/game/scoreboard/scoreboard";
import Card from "../../components/game/card/card";
import Decisions from "../../components/game/decisions/decisions";
import InfoIsland from "../../components/game/infoIsland/infoIsland";
import './game.scss';
import DebugConsolePopup from '../../popups/debug/DebugConsolePopup';
import SessionJoin from '../../popups/sessionJoin/sessionJoin';

const Game = () => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSessionJoinOpen, setIsSessionJoinOpen] = useState(true); 

  const openConsole = () => {
    setIsConsoleOpen(true);
  };

  const closeConsole = () => {
    setIsConsoleOpen(false);
  };

  const closeSessionJoin = () => {
    setIsSessionJoinOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSessionJoinOpen(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="game-container">
      <button onClick={openConsole}>Otwórz Konsolę Debug</button>
      <DebugConsolePopup isOpen={isConsoleOpen} onClose={closeConsole} />
      <SessionJoin isOpen={isSessionJoinOpen} onClose={closeSessionJoin} />
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
