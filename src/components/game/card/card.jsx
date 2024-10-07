import React, { useContext } from "react";
import { WebsocketContext } from "../../../context/WebsocketContext";
import './card.scss';

const Card = () => {
  const {
    toDisplay: { get: toDisplay },
  } = useContext(WebsocketContext);

  if (!toDisplay || (typeof toDisplay === 'string' && toDisplay.trim() === '')) {
    return null; 
  }

  let content = null;

  if (typeof toDisplay === 'string') {
    try {
      content = JSON.parse(toDisplay);
    } catch (e) {
      console.error('Failed to parse toDisplay:', e);
      return null; 
    }
  } else if (typeof toDisplay === 'object') {
    content = toDisplay;
  } else {
    console.error('toDisplay is neither a string nor an object');
    return null;
  }

  const elements = [];
  for (let i = 0; i < content.text.length; i++) {
    const item = content.text[i];
    let style = { color: item.text_color || content.general_text || 'black' };

    if (item.bold || (item.type === 'header' && item.bold !== false)) {
      style.fontWeight = 'bold';
    }

    switch (item.type) {
      case 'header':
        elements.push(
          <h1 key={i} style={{ ...style, textAlign: 'center' }}>
            {item.content}
          </h1>
        );
        break;

      case 'span':
        elements.push(
          <p key={i} style={style}>
            {item.content}
          </p>
        );
        break;

      case 'list':
        const listItems = [];
        i++; 
        while (i < content.text.length && content.text[i].type === 'list_element') {
          const listItem = content.text[i];
          const listItemStyle = { color: listItem.text_color || content.general_text || 'black' };
          if (listItem.bold) {
            listItemStyle.fontWeight = 'bold';
          }
          listItems.push(
            <li key={i} style={listItemStyle}>
              {listItem.content}
            </li>
          );
          i++;
        }
        i--; 
        elements.push(
          <div key={i}>
            <p style={style}>{item.content}</p>
            <ul>{listItems}</ul>
          </div>
        );
        break;

      case 'list_element':
        break;

      default:
        console.warn(`Unknown type: ${item.type}`);
        break;
    }
  }
  return (
    <div className="container" style={{ backgroundColor: content.bg || 'white' }}>
      <div className="card">
        {elements}
      </div>
    </div>
  );
};

export default Card;
