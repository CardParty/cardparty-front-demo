import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import "./lobby_Players.scss";

const LobbyPlayers = () => {
  const { players, username } = useContext(WebsocketContext);

  return (
    <div className="players-container">
      <h2 className="players-title">Players List</h2>
      <ul className="players-list">
        {players.get.length > 0 ? (
          players.get.map((player, index) => (
            <li
              key={index}
              className={`player-item ${player.username === username.get ? "me" : ""}`}
            >
              {player.username}
            </li>
          ))
        ) : (
          <li className="player-item">No players connected</li>
        )}
      </ul>
    </div>
  );
};

export default LobbyPlayers;
