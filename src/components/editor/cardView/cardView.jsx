import React, { useState } from "react";
import "./cardView.scss";

const CardView = () => {
  const [cards, setCards] = useState([{ content: "Jaja mnie swedza" }]);

  const updateCard = (index, newContent) => {
    const updatedCards = cards.map((card, i) =>
      i === index ? { ...card, content: newContent } : card
    );
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { content: "" }]);
  };

  return (
    <div className="card-editor">
      <div className="editor">
        <h3>Card Editor</h3>
        {cards.map((card, index) => (
          <div key={index}>
            <textarea
              value={card.content}
              onChange={(e) => updateCard(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={addCard}>Add Card</button>
      </div>
      <div className="preview">
        <h3>Rendered View</h3>
        {cards.map((card, index) => (
          <div key={index}>
            <p>{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardView;
