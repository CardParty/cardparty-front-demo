import React, { useState } from "react";
import "./navigationBar.scss";

const NavigationBar = () => {
  const [deckName, setDeckName] = useState("");

  const saveDeck = () => {
    console.log("Deck saved:", deckName);
  };

  const newDeck = () => {
    setDeckName("");
  };

  return (
    <div className="deck">
      <input
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Deck Name"
      />
      <button onClick={saveDeck}>Save Deck</button>
      <button onClick={newDeck}>New Deck</button>
    </div>
  );
};

export default NavigationBar;
