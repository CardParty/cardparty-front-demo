import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import './card.scss';

const Card = () => {
  const {
    toDisplay: { get: toDisplay },
  } = useContext(WebsocketContext);

  console.log('toDisplay:', toDisplay);

  if (!toDisplay || Object.keys(toDisplay).length === 0) {
    return null; 
  }

  const content = toDisplay;


  if (!content.text) {
    console.error('Invalid content structure:', content);
    return null;
  }

  const textItems = content.text;
  const generalTextColor = content.general_text || 'black';
  const bgColor = content.bg || 'white';
  const elements = [];

  for (let i = 0; i < textItems.length; i++) {
    const item = textItems[i];
    let style = { color: item.text_color || generalTextColor };

    if (item.bold || (item.type === 'header' && item.bold !== false)) {
      style.fontWeight = 'bold';
    }

    switch (item.type) {
      case 'header':
        elements.push(
          <span key={i} style={{ ...style, textAlign: 'center', display: 'inline' }}>
            <strong>{item.content}</strong>
          </span>
        );
        break;

      case 'span':
      default:
        elements.push(
          <span key={i} style={{ ...style, display: 'inline' }}>
            {item.content}
          </span>
        );
        break;
    }

    if (i < textItems.length - 1) {
      elements.push(' ');
    }
  }

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <div className="card">
        {elements}
      </div>
    </div>
  );
};

export default Card;
