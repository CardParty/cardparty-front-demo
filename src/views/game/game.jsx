import Scoreboard from "../../components/game/scoreboard/scoreboard";
import Card from "../../components/game/card/card";
import Decisions from "../../components/game/decisions/decisions";
import InfoIsland from "../../components/game/infoIsland/infoIsland";
import { WebsocketContextProvider } from "../../context/WebsocketContext";

const Game = () => {
  return (
    <div>
      <Scoreboard />
      <Card />
      <Decisions />
      <InfoIsland />
    </div>
  );
};

export default Game;
