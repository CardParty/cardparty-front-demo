import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";

const Decisions = () => {
  const { decisionsArray, nextPlayer, doChoise } = useContext(WebsocketContext);

  return (
    <div>
      {decisionsArray.length > 0 ? (
        <div>
          <h3>Choose!</h3>
          {console.log(decisionsArray)}
          <ul>
            {decisionsArray.map((decision, index) => (
              <li key={index} onClick={() => doChoise(decision)}>
                {decision.display}
              </li>
            ))}
          </ul>
        </div>
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
