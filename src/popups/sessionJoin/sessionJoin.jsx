import React from 'react';
import Popup from '../popup';
import './sessionJoin.css';

const SessionJoin = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="session-join">
        <h2>Pomyślnie dołączyłeś do sesji</h2>
        <button onClick={onClose}>OK</button>
      </div>
    </Popup>
  );
};

export default SessionJoin;
