import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import './card.scss';

const Card = () => {
  const {
    toDisplay: { get: toDisplay },
  } = useContext(WebsocketContext);

  return (
    <div className="container"> 
      <div className="card">
        <textarea
          name="card"
          id="card"
          cols={30}
          rows={40}
          value={toDisplay}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default Card;
