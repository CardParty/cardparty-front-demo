import { useState, useEffect, createContext } from "react";
import { v4 as uuid } from "uuid";
import deck from "../mock/deck.json";
import game_state from "../mock/game_state.json";
import animals from "../mock/animals.json";
import { useNavigate } from "react-router-dom";

const WebsocketContext = createContext();

const WebsocketContextProvider = ({ children }) => {
  const CLIENT_STATES = {
    NOT_CONNECTED: "NOT_CONNECTED",
    IN_LOBBY: "IN_LOBBY",
    IN_GAME: "IN_GAME",
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
  const [decks, setDecks] = useState([deck, animals]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const [decisions, setDecisions] = useState([]);
  const [chosie, setChoise] = useState(null);
  const [toDisplay, setToDisplay] = useState({});

  const [isHost, setIsHost] = useState(false);

  const [gameState, setGameState] = useState(game_state);

  const API_URL = "http://localhost:8080";

  const [logs, setLogs] = useState([]);

  const addLog = (type, ...messages) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const newLog = {
      timestamp,
      type,
      messages,
    };
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  const customConsole = {
    log: (...messages) => addLog("log", ...messages),
    error: (...messages) => addLog("error", ...messages),
    warn: (...messages) => addLog("warn", ...messages),
    info: (...messages) => addLog("info", ...messages),
  };

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
            customConsole.log("WebSocket connection established");
          };

          ws.onerror = (error) => {
            customConsole.error("WebSocket connection error:", error);
            setClientState(CLIENT_STATES.NOT_CONNECTED);
          };

          initializeWebSocketHandlers(ws);
        } else {
          throw new Error("Failed to unwrap Session Code");
        }
      } catch (error) {
        customConsole.error("Error joining session:", error);
        setClientState(CLIENT_STATES.NOT_CONNECTED);
      }
    }
  };

  const createSession = async () => {
    try {
      if (userId === "" || (username === "" && selectedDeck != null)) {
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
          deck: selectedDeck,
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
      customConsole.error("Failed to create a game", error);
      setClientState(CLIENT_STATES.NOT_CONNECTED);
    }
  };

  const messageHandlers = {
    PlayerUpdateOk: (msg) => {
      customConsole.log("PlayerUpdateOk", msg);
      setPlayers(msg.players);
    },
    GetPlayersOk: (msg) => {
      customConsole.log("GetPlayersOk", msg);
      setPlayers(msg.players);
    },
    CardResultOk: (msg) => {
      customConsole.log("CardResultOk", msg);
      setDecisions(msg.card.state_options);
      setToDisplay(msg.card.text);
    },
    UpdateStateOk: (msg) => {
      customConsole.log("UpdateStateOk", msg);
      setGameState(msg.bundle);
    },
    StartGameOk: (msg) => {
      customConsole.log("StartGameOk", msg);
      setClientState(CLIENT_STATES.IN_GAME);
      navigateGame();
    },
    FinishGameOk: (msg) => {
      customConsole.log("FinishGameOk", msg);
      setClientState(CLIENT_STATES.IN_LOBBY);
      navigateLobby();
    },
  };

  const handleMessage = (msg) => {
    try {
      const handler = messageHandlers[msg.packet];
      if (handler) {
        customConsole.log("Handling Packet:", msg);
        handler(msg);
      } else {
        customConsole.warn("Unknown Packet:", msg.packet);
      }
    } catch (error) {
      customConsole.error("Error handling message:", error);
    }
  };

  const initializeWebSocketHandlers = (ws) => {
    ws.onmessage = (event) => {
      try {
        let msg = JSON.parse(event.data);
        customConsole.log("Got packet:", msg);
        handleMessage(msg);
      } catch (error) {
        customConsole.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      customConsole.warn("Websocket connection closed");
      setWebsocketConn(null);
      setClientState(CLIENT_STATES.NOT_CONNECTED);
      setPlayers([]);
      setConnectedSessionCode("");
      setIsHost(false);
    };

    ws.onerror = (error) => {
      customConsole.error("Websocket Error:", error);
    };
  };

  const sendMessage = (message) => {
    if (websocketConn && websocketConn.readyState === WebSocket.OPEN) {
      customConsole.info("Sending message:", message);
      websocketConn.send(message);
    } else {
      customConsole.error("WebSocket is not open. Unable to send message.");
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
  const startGame = () => {
    sendMessage(JSON.stringify({ packet: "StartGame" }));
  };
  const endGame = () => {
    sendMessage(JSON.stringify({ packet: "FinishGame" }));
  };

  const dump = () => {
    sendMessage("dump");
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
        clientState,
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
        startGame,
        endGame,
        logs,
        addLog,
        customConsole,
        websocketConn,
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
        CLIENT_STATES,
        startGame,
        endGame,
        dump,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

export { WebsocketContextProvider, WebsocketContext };
