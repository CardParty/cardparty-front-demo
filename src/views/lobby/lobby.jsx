import ConnectionPanel from "../../components/lobby/connectionPanel/connection_panel";
import DeckSelector from "../../components/lobby/deckSelector/deckselector";
import LobbyPlayers from "../../components/lobby/lobbyPlayers/lobby_players";
import { WebsocketContextProvider } from "../../context/WebsocketContext";

const Lobby = () => {
  return (
    <div>
      <ConnectionPanel />
      <DeckSelector />
      <LobbyPlayers />
    </div>
  );
};

export default Lobby;
