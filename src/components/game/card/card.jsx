import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";

const Card = () => {
  const {
    toDisplay: { get: toDisplay },
  } = useContext(WebsocketContext);

  return (
    <div className={`Card`}>
      <textarea
        name="card"
        id="card"
        cols={30}
        rows={40}
        value={toDisplay}
        readOnly
      ></textarea>
    </div>
  );
};

export default Card;
