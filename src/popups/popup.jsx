import React from 'react';
import './Popup.scss'

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Popup;
