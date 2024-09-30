import React, { useState } from 'react';
import ConnectionPanel from "../../components/lobby/connectionPanel/connection_panel";
import DeckSelector from "../../components/lobby/deckSelector/deckselector";
import LobbyPlayers from "../../components/lobby/lobbyPlayers/lobby_players";
import DebugConsolePopup from '../../popups/debug/DebugConsolePopup';

const Lobby = () => {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const openConsole = () => {
    setIsConsoleOpen(true);
  };

  const closeConsole = () => {
    setIsConsoleOpen(false);
  };

  return (
    <div>
        {/* <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <h2>Witamy na naszej stronie!</h2>
        <p>To jest wiadomość powitalna wyświetlana od razu po wejściu.</p>
        <button onClick={closePopup}>Zamknij</button>
      </Popup> */}
      <button onClick={openConsole}>Otwórz Konsolę Debug</button>
      <DebugConsolePopup isOpen={isConsoleOpen} onClose={closeConsole} />
      <ConnectionPanel />
      <DeckSelector />
      <LobbyPlayers />
    </div>
  );
};

export default Lobby;
