import React from 'react';
import './ConfirmDialog.css';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">
          <FiAlertTriangle size={40} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;