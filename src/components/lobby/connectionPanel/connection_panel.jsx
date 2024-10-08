import "./connection_panel.scss";
import React, { useContext, useState } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";

const ConnectionPanel = () => {
  const [gameId, setGameId] = useState("");

  const {
    username: { get: username, set: setUsername },
    connectedSessionCode: {
      set: setConnectedSessionCode,
      get: connectedSessionCode,
    },
    createSession,
    joinSession,
    navigateGame,
  } = useContext(WebsocketContext);

  const handleCreateSession = () => {
    createSession();
  };

  const handleJoinSession = () => {
    joinSession(gameId);
  };

  return (
    <div className="session-container">
      <div className="session-content">
        <div className="session-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
          />
          <input
            type="text"
            placeholder="Game Code"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="session-input"
          />
          <span>Session Code: {connectedSessionCode}</span>
          <div className="session-id-section">
            <button className="new-button" onClick={handleCreateSession}>
              New
            </button>
            <button className="join-button" onClick={handleJoinSession}>
              Join
            </button>
            <button className="start-button" onClick={navigateGame}>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPanel;
