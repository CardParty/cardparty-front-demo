import React, { useState } from "react";
import './sidePanel.scss'

const SidePanel = () => {
  const [tables, setTables] = useState([{ tableName: "Table Name", rows: [{ value: "", tags: [] }] }]);

  const addTable = () => {
    setTables([...tables, { tableName: "Table Name", rows: [{ value: "", tags: [] }] }]);
  };

  const deleteTable = (tableIndex) => {
    setTables(tables.filter((_, i) => i !== tableIndex));
  };

  const addRow = (tableIndex) => {
    const newTables = tables.map((table, index) =>
      index === tableIndex ? { ...table, rows: [...table.rows, { value: "", tags: [] }] } : table
    );
    setTables(newTables);
  };

  const updateTableName = (tableIndex, newName) => {
    const updatedTables = tables.map((table, index) =>
      index === tableIndex ? { ...table, tableName: newName } : table
    );
    setTables(updatedTables);
  };

  const updateValue = (tableIndex, rowIndex, newValue) => {
    const updatedTables = tables.map((table, tIndex) =>
      tIndex === tableIndex ? {
        ...table,
        rows: table.rows.map((row, rIndex) =>
          rIndex === rowIndex ? { ...row, value: newValue } : row
        )
      } : table
    );
    setTables(updatedTables);
  };

  const addTag = (tableIndex, rowIndex, newTag) => {
    const updatedTables = tables.map((table, tIndex) =>
      tIndex === tableIndex ? {
        ...table,
        rows: table.rows.map((row, rIndex) =>
          rIndex === rowIndex ? { ...row, tags: [...row.tags, newTag] } : row
        )
      } : table
    );
    setTables(updatedTables);
  };

  const removeTag = (tableIndex, rowIndex, tagIndex) => {
    const updatedTables = tables.map((table, tIndex) =>
      tIndex === tableIndex ? {
        ...table,
        rows: table.rows.map((row, rIndex) =>
          rIndex === rowIndex ? { ...row, tags: row.tags.filter((_, t) => t !== tagIndex) } : row
        )
      } : table
    );
    setTables(updatedTables);
  };

  return (
    <div className="side-panel">
      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="table">
          <div className="table-header">
            <input
              type="text"
              value={table.tableName}
              onChange={(e) => updateTableName(tableIndex, e.target.value)}
              placeholder="Table Name"
            />
            <button onClick={() => deleteTable(tableIndex)}>X</button>
          </div>
          {table.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              <input
                type="text"
                value={row.value}
                onChange={(e) => updateValue(tableIndex, rowIndex, e.target.value)}
                placeholder="Value..."
              />
              <div className="tags">
                {row.tags.map((tag, tagIndex) => (
                  <span key={tagIndex}>
                    {tag} <button onClick={() => removeTag(tableIndex, rowIndex, tagIndex)}>x</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add Tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addTag(tableIndex, rowIndex, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
          <button onClick={() => addRow(tableIndex)}>Add Row</button>
        </div>
      ))}
      <button onClick={addTable}>Add Table</button>
    </div>
  );
};

export default SidePanel;
