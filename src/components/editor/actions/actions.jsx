import React, { useState } from "react";
import "./actions.scss";

const Actions = () => {
  const [actions, setActions] = useState([{ state: "", value: "", playerFilter: "Current" }]);

  const updateAction = (index, field, newValue) => {
    const updatedActions = actions.map((action, i) =>
      i === index ? { ...action, [field]: newValue } : action
    );
    setActions(updatedActions);
  };

  const addAction = () => {
    setActions([...actions, { state: "", value: "", playerFilter: "Current" }]);
  };

  return (
    <div className="action-editor">
      <h3>Action Editor</h3>
      {actions.map((action, index) => (
        <div key={index}>
          <input
            type="text"
            value={action.state}
            onChange={(e) => updateAction(index, "state", e.target.value)}
            placeholder="State"
          />
          <input
            type="text"
            value={action.value}
            onChange={(e) => updateAction(index, "value", e.target.value)}
            placeholder="Value"
          />
          <select
            value={action.playerFilter}
            onChange={(e) => updateAction(index, "playerFilter", e.target.value)}
          >
            <option value="Current">Current</option>
            <option value="Next">Next</option>
            <option value="Previous">Previous</option>
            <option value="Random">Random</option>
          </select>
        </div>
      ))}
      <button onClick={addAction}>Add Action</button>
    </div>
  );
};

export default Actions;
