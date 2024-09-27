import React, { useState } from "react";

const DeckSelector = () => {
  const [selectedDeck, setSelectedDeck] = useState("Deck 1");

  const handleDeckSelect = (deckName) => {
    setSelectedDeck(deckName);
  };

  return (
    <div className="decks">
      <h1>Decks</h1>
      <h3>Selected: {selectedDeck || "None"}</h3>
      <div className="deck-list">
        {[].map((deck, index) => (
          <div
            key={index}
            className={`deck-item ${selectedDeck === deck ? "selected" : ""}`}
            onClick={() => handleDeckSelect(deck)}
          >
            {deck}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckSelector;