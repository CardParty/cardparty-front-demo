import React from "react";

import "./style.scss";

const Card = (props) => {
  const { text, textCallback } = props;
  return (
    <div className={`Card`}>
      <textarea
        name="card"
        id="card"
        cols={30}
        rows={40}
        value={text}
        onChange={(e) => {
          textCallback(e.target.value);
        }}
      ></textarea>
    </div>
  );
};

export default Card;