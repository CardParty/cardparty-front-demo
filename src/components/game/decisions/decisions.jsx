import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import './decisions.scss'

const Decisions = () => {
  const { decisionsArray, nextPlayer, doChoise } = useContext(WebsocketContext);

  return (
    <div className="decisions-container decisions">
      {decisionsArray.length > 0 ? (
        <>
          <h3>Choose!</h3>
          <ul>
            {decisionsArray.map((decision, index) => (
              <li key={index} onClick={() => doChoise(decision)}>
                {decision.display}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p>No available decisions.</p>
          <button onClick={nextPlayer}>Next</button>
        </>
      )}
    </div>
  );
};

export default Decisions;
