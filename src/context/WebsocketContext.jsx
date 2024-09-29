import { useState, useEffect, useContext, createContext } from "react";
import { v4 as uuid } from "uuid";
import deck from "../mock/deck.json";
import game_state from "../mock/game_state.json";

import { useNavigate } from "react-router-dom";

const WebsocketContext = createContext();
const WebsocketContextProvider = ({ children }) => {
  const CLIENT_STATES = {
    NOT_CONNECTED: "NOT_CONNECTED",
    IN_LOBBY: "IN_LOBBY",
    IN_GAME: "IN_GAME",
    // Add more states as needed
  };

  const navigate = useNavigate();

  const PacketGenerator = {
    GetPlayers: () => {
      return JSON.stringify({
        packet: "GetPlayers",
      });
    },
    PlayerDoneChoise: (choise) => {
      return JSON.stringify({
        packet: "PlayerDoneChoise",
        chosen: choise.id,
      });
    },
    setDeck: (deck) => {
      return JSON.stringify({
        packet: "SetDeck",
        deck: deck,
      });
    },
    PlayerDone: () => {
      return JSON.stringify({
        packet: "PlayerDone",
      });
    },
    CloseSession: () => {
      return JSON.stringify({
        packet: "CloseSession",
      });
    },
  };

  const [players, setPlayers] = useState([]);
  const [websocketConn, setWebsocketConn] = useState(null);
  const [dataListeners, setDataListeners] = useState([]);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [clientState, setClientState] = useState(CLIENT_STATES.NOT_CONNECTED);
  const [connectedSessionCode, setConnectedSessionCode] = useState("");
  const [decks, setDecks] = useState([deck, { meta: { name: "Deck 2" } }]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const [decisions, setDecisions] = useState([]); // options to display
  const [chosie, setChoise] = useState(null); // id of the option that was chosen
  const [toDisplay, setToDisplay] = useState(""); // text to display on card

  const [isHost, setIsHost] = useState(false);

  const [gameState, setGameState] = useState(game_state);

  const API_URL = "http://localhost:8080";

  // [ {id:"uuid", display:"fhfhfhhfhfhfh"}]
  ``;
  // <button onClick()=>{setChoise(id)}>fhfhfhfhfhfhf<button/>

  // load username from localstorage or create a default one if it does not exist
  useEffect(() => {
    const lsUsername = localStorage.getItem("username");
    const defaultUsername = "User";
    if (lsUsername) {
      setUsername(lsUsername);
    } else {
      localStorage.setItem("username", defaultUsername);
      setUsername(defaultUsername);
    }
  }, []);

  useEffect(() => {
    if (selectedDeck && isHost) {
      sendMessage(PacketGenerator.setDeck(selectedDeck));
    }
  }, [selectedDeck]);

  // load userId from localstorage or create a new one if it does not exist
  useEffect(() => {
    const lsUserId = localStorage.getItem("userId");
    if (lsUserId) {
      setUserId(lsUserId);
    } else {
      const id = uuid();
      localStorage.setItem("userId", id);
      setUserId(id);
    }
  }, []);

  // update localStorage username if username changes
  useEffect(() => {
    if (username !== "") {
      localStorage.setItem("username", username);
    }
  }, [username]);

  const nextPlayer = () => {
    sendMessage(PacketGenerator.PlayerDone());
  };

  const doChoise = (id) => {
    setChoise(id);
    sendMessage(PacketGenerator.PlayerDoneChoise(id));
    setChoise(null);
  };

  const joinSession = async (sessionCode) => {
    if (
      !websocketConn &&
      clientState === CLIENT_STATES.NOT_CONNECTED &&
      username !== "" &&
      userId !== ""
    ) {
      try {
        let sessionId = "";
        const resp = await fetch(`${API_URL}/game/unwrap_session_code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionCode),
        });

        if (!resp.ok) {
          throw new Error("No session under provided session code");
        } else {
          sessionId = await resp.json();
        }

        if (sessionId !== "") {
          const ws = new WebSocket(
            `${API_URL}/game/join?session_id=${sessionId}&user_id=${userId}&username=${username}`
          );

          ws.onopen = () => {
            setWebsocketConn(ws);
            setClientState(CLIENT_STATES.IN_LOBBY);
            console.log("WebSocket connection established");
          };

          ws.onerror = (error) => {
            console.error("WebSocket connection error:", error);
            setClientState(CLIENT_STATES.NOT_CONNECTED);
          };

          initializeWebSocketHandlers(ws);
        } else {
          throw new Error("Failed to unwrap Session Code");
        }
      } catch (error) {
        console.error("Error joining session:", error);
        setClientState(CLIENT_STATES.NOT_CONNECTED);
      }
    }
  };

  const createSession = async () => {
    try {
      if (userId === "" || username === "") {
        throw new Error("UserId or Username is empty");
      }

      const response = await fetch(`${API_URL}/game/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_id: userId,
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const { id: sessionId, code: sessionCode } = await response.json();
      setConnectedSessionCode(sessionCode);

      if (sessionCode !== "") {
        await joinSession(sessionCode);
        setIsHost(true);
      } else {
        throw new Error("No session code to connect with");
      }
    } catch (error) {
      console.error("Failed to create a game", error);
      setClientState(CLIENT_STATES.NOT_CONNECTED);
    }
  };

  const messageHandlers = {
    PlayerUpdateOk: (msg) => {
      console.log("PlayerUpdate", msg);
      setPlayers(msg.players);
    },
    GetPlayersOk: (msg) => {
      console.log("GetPlayersOk", msg);
      setPlayers(msg.players);
    },
    CardResultOk: (msg) => {
      console.log("CardResultOk", msg);
      setDecisions(msg.card.state_options);
      setToDisplay(msg.card.text);
    },
    UpdateStateOk: (msg) => {
      console.log("UpdateState", msg);
      setGameState(msg.bundle);
    },
  };

  const handleMessage = (msg) => {
    try {
      const handler = messageHandlers[msg.packet];
      if (handler) {
        console.log("Handling Packet:", msg);
        handler(msg);
      } else {
        console.warn("Unknown Packet:", msg.packet);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  const initializeWebSocketHandlers = (ws) => {
    ws.onmessage = (event) => {
      try {
        let msg = JSON.parse(event.data);
        console.log("Got packet:", msg);
        handleMessage(msg);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      console.warn("Websocket connection closed");
      setWebsocketConn(null);
      setClientState(CLIENT_STATES.NOT_CONNECTED);
      setPlayers([]);
      setConnectedSessionCode("");
      setIsHost(false); // Reset isHost state on WebSocket close
    };

    ws.onerror = (error) => {
      console.error("Websocket Error:", error);
    };
  };

  const sendMessage = (message) => {
    if (websocketConn && websocketConn.readyState === WebSocket.OPEN) {
      console.info("Sending message:", message);
      websocketConn.send(message);
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  };

  const navigateGame = () => {
    if (websocketConn && websocketConn.readyState === WebSocket.OPEN) {
      navigate("/game");
      sendMessage(PacketGenerator.PlayerDone());
    }
  };
  const navigateEditor = () => {
    navigate("/editor");
  };
  const navigateLobby = () => {
    navigate("/");
  };

  return (
    <WebsocketContext.Provider
      value={{
        players: {
          set: setPlayers,
          get: players,
        },
        username: {
          set: setUsername,
          get: username,
        },
        userId: {
          set: setUserId,
          get: userId,
        },
        clientState: {
          set: setClientState,
          get: clientState,
        },
        connectedSessionCode: {
          set: setConnectedSessionCode,
          get: connectedSessionCode,
        },
        decks: {
          set: setDecks,
          get: decks,
        },
        decisions: {
          set: setDecisions,
          get: decisions,
        },
        chosie: {
          set: setChoise,
          get: chosie,
        },
        selectedDeck: {
          set: setSelectedDeck,
          get: selectedDeck,
        },
        isHost: {
          set: setIsHost,
          get: isHost,
        },
        toDisplay: {
          set: setToDisplay,
          get: toDisplay,
        },
        gameState: {
          set: setGameState,
          get: gameState,
        },
        joinSession,
        createSession,
        sendMessage,
        doChoise,
        nextPlayer,
        navigateEditor,
        navigateGame,
        navigateLobby,
        decisionsArray: decisions,
        PacketGenerator,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

export { WebsocketContextProvider, WebsocketContext };
