import React, { useContext, useState, useEffect } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";

const Decisions = () => {
  const {
    decisions: { set: setDecisions, get: decisions },
    nextPlayer,
    doChoise,
  } = useContext(WebsocketContext);

  return (
    <div>
      <h3>Panel Decyzji</h3>
      {decisions.length > 0 ? (
        <ul>
          {decisions.map((decision, index) => (
            <li key={index} onClick={() => doChoise(decision)}>
              {decision.text}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>Brak dostępnych decyzji.</p>
          <button onClick={nextPlayer}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Decisions;
