import { useState } from "react";
import { WebsocketContext } from "./../../../context/WebsocketContext"
const Decisions = () => {
  const {
    decisions: {
      set: setDecisions,
      get: decisions,
    },
    chosie:{
      set: setChoise,
      get: chosie
    },
  } = useContext(WebsocketContext);on
}

export default Decisions;