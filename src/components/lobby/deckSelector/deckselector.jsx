import React, { useContext, useState } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";

const DeckSelector = () => {
  const {
    selectedDeck: { set: setSelectedDeck, get: selectedDeck },
    decks: { set: setDecks, get: decks },
    isHost: { get: isHost },
  } = useContext(WebsocketContext);

  return (
    <div className="decks">
      <h1>Decks</h1>
      <h3>
        Selected:{" "}
        {selectedDeck != null
          ? selectedDeck.meta.deck_name
          : "No deck selected"}
      </h3>
      <div className="deck-list">
        {decks.map((deck, index) => (
          <div
            key={index}
            className={`deck-item ${selectedDeck === deck ? "selected" : ""}`}
            onClick={() => setSelectedDeck(deck)}
          >
            <strong>{deck.meta.deck_name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckSelector;
