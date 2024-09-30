import React, { useState, useContext } from "react";
import Popup from "../popup";
import "./DebugConsolePopup.css";
import { WebsocketContext } from "../../context/WebsocketContext";

const DebugConsolePopup = ({ isOpen, onClose }) => {
  const {
    logs,
    players,
    selectedDeck,
    websocketConn,
    clientState,
    CLIENT_STATES,
  } = useContext(WebsocketContext);

  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpand = (index) => {
    setExpandedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const wsConnectionStatus =
    websocketConn && websocketConn.readyState === WebSocket.OPEN
      ? "Connected"
      : "Not Connected";

  const deckName = selectedDeck.get ? selectedDeck.get.name : "No Deck Selected";

  const playerNames =
    players.get && players.get.length > 0
      ? players.get.map((player) => player.username).join(", ")
      : "No Players";

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="debug-console">
        <h2>Konsola Debug</h2>

        <div className="debug-info">
          <p>
            <strong>WsConnection:</strong> {wsConnectionStatus}
          </p>
          <p>
            <strong>Deck:</strong> {deckName}
          </p>
          <p>
            <strong>Players:</strong> {playerNames}
          </p>
          <p>
            <strong>ClientState:</strong> {clientState}
          </p>
        </div>

        <div className="console-messages">
          {logs &&
            logs.map((log, index) => {
              const isExpanded = expandedIndices.includes(index);
              const mainMessage =
                log.messages.find((msg) => typeof msg === "string") || "";
              return (
                <div key={index} className={`console-message ${log.type}`}>
                  <div
                    onClick={() => toggleExpand(index)}
                    className="console-summary"
                  >
                    <span className="timestamp">[{log.timestamp}]</span>{" "}
                    <span>{mainMessage}</span>
                  </div>
                  {isExpanded && (
                    <div className="console-details">
                      {log.messages.map((msg, i) => (
                        <pre key={i}>
                          {typeof msg === "object"
                            ? JSON.stringify(msg, null, 2)
                            : msg}
                        </pre>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <button onClick={onClose}>Zamknij Konsolę</button>
      </div>
    </Popup>
  );
};

export default DebugConsolePopup;
